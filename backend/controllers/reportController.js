
const Submission = require("../models/Submission");
const ResultPublication = require("../models/ResultPublication");
const SchoolResult = require("../models/SchoolResult");
const CRITERIA_CONFIG = require("../config/criteriaConfig");
const logger = require("../utils/logger.js");
const { calculateGrade } = require("../utils/gradeHelper");

// Helper to attach grades to a school result object
const attachGradesToSchool = (school) => {
  if (!school) return school;
  if (Array.isArray(school.criteria)) {
    school.criteria = school.criteria.map((c) => ({
      ...c,
      grade: c.grade || calculateGrade(c.percentage),
    }));
  }
  if (school.finalScore) {
    const totalWeighted = school.finalScore.totalWeightedScore ?? 0;
    school.finalScore = {
      ...school.finalScore,
      grade: school.finalScore.grade || calculateGrade(totalWeighted),
    };
  }
  return school;
};


exports.getAllSchoolsCriteriaReport = async (req, res) => {
  try {
    const { academicYear } = req.query;

    if (!academicYear) {
      return res.status(400).json({ message: "academicYear is required" });
    }

    // Check Publication Status
    const publishedRecord = await ResultPublication.findOne({ academicYear });

    if (!publishedRecord || !publishedRecord.isPublished) {
      return res.status(403).json({
        message: "Results not published for this academic year",
        isPublished: false
      });
    }

    // Check if stored snapshot exists (preferred source)
    const savedResults = await SchoolResult.find({ academicYear }).lean();

    if (savedResults.length > 0) {
      const enriched = savedResults.map(attachGradesToSchool);
      return res.status(200).json({
        academicYear,
        schools: enriched,
        source: "stored"
      });
    }

    // console.log("⚠ No stored snapshot found — regenerating from submissions...");

    logger.info(`⚠ No stored snapshot found — regenerating from submissions...`, {
      AcademicYear: academicYear || "",
      controller: "reportController/getAllSchoolCriteriaReport"
    })

    // Fetch data from submissions only if needed
    const results = await Submission.aggregate([
      {
        $match: {
          academicYear,
          status: { $in: ["Completed", "Appeal Closed"] }
        }
      },
      { $unwind: "$partB.criteria" },
      { $unwind: "$partB.criteria.subCriteria" },
      { $unwind: "$partB.criteria.subCriteria.indicators" },
      {
        $group: {
          _id: {
            school: "$school",
            criteriaCode: "$partB.criteria.criteriaCode"
          },
          totalScore: {

            $sum: {
              $ifNull: [
                "$partB.criteria.subCriteria.indicators.finalScore",
                {
                  $ifNull: [
                    "$partB.criteria.subCriteria.indicators.reviewScore",
                    0
                  ]
                }
              ]
            }

          }
        }
      },
      {
        $lookup: {
          from: "schools",
          localField: "_id.school",
          foreignField: "_id",
          as: "schoolInfo"
        }
      },
      { $unwind: "$schoolInfo" },
      { $sort: { "_id.criteriaCode": 1 } },
      {
        $project: {
          _id: 0,
          schoolId: "$_id.school",
          schoolName: "$schoolInfo.name",
          criteriaCode: "$_id.criteriaCode",
          totalScore: 1
        }
      }
    ]);

    // Rebuild structure like before
    const schoolsMap = {};
    for (const row of results) {
      const { schoolId, schoolName, criteriaCode, totalScore } = row;

      if (!schoolsMap[schoolId]) {
        schoolsMap[schoolId] = {
          academicYear,
          schoolId,
          schoolName,
          criteria: [],
          finalScore: 0
        };
      }

      const configKey = `C${criteriaCode}`;
      const config = CRITERIA_CONFIG[configKey];
      if (!config) continue;

      const percentage = (totalScore / config.maxMarks) * 100;
      const weightedScore = (percentage * config.weightage) / 100;
      const grade = calculateGrade(percentage);

      schoolsMap[schoolId].criteria.push({
        code: criteriaCode,
        name: config.name,
        weightage: config.weightage,
        maxMarks: config.maxMarks,
        marksAwarded: Number(totalScore.toFixed(2)),
        percentage: Number(percentage.toFixed(2)),
        weightedScore: Number(weightedScore.toFixed(2)),
        grade: grade
      });

      schoolsMap[schoolId].finalScore += weightedScore;
    }

    const structuredSchools = Object.values(schoolsMap).map((school) => {
      // sort criteria
      school.criteria.sort((a, b) => a.code.localeCompare(b.code));
      // add S.No
      school.criteria.forEach((item, i) => (item.sNo = i + 1));
      const totalWeighted = Number(school.finalScore.toFixed(2));
      school.finalScore = {
        totalWeightedScore: totalWeighted,
        outOf: 100,
        grade: calculateGrade(totalWeighted)
      };
      return school;
    });

    // Save fresh snapshot for future
    if (structuredSchools.length > 0) {
      await SchoolResult.insertMany(structuredSchools);
      // console.log("🔥 Fresh SchoolResult snapshot saved for", academicYear);

      logger.info(`🔥 Fresh SchoolResult snapshot saved  for : ${academicYear || " "}`, {
        AcademicYear: academicYear || "",
        controller: "reportController/getAllSchoolCriteriaReport"
      })
    }

    return res.status(200).json({
      academicYear,
      schools: structuredSchools,
      source: "fresh"
    });

  } catch (error) {
    // console.error("Report Error:", error);
    logger.error(`Report Error `, {
      message: error.message || "",
      stack: error.stack || "",
      controller: "reportController/getAllSchoolCriteriaReport"
    })
    res.status(500).json({ message: "Failed to generate report" });
  }
};


exports.getMySchoolReport = async (req, res) => {
  try {
    const { academicYear } = req.query;
    const schoolId = req.user.school;


    if (!academicYear) {
      return res.status(400).json({ message: "academicYear is required" });
    }
    if (!schoolId) {
      return res.status(403).json({ message: "School not associated with user" });
    }

    const publishedRecord = await ResultPublication.findOne({ academicYear });
    if (!publishedRecord || !publishedRecord.isPublished) {
      return res.status(403).json({
        message: "Results not published for this academic year",
        isPublished: false,
      });
    }

    const result = await SchoolResult.findOne({ academicYear, schoolId }).lean();
    if (!result) {
      return res.status(404).json({
        message: "No result found for your school",
      });
    }




    return res.status(200).json(attachGradesToSchool(result));

  } catch (error) {
    // console.error("Error fetching my school report:", error);
    logger.error(`Error fetching (department) my school report`, {
      message: error.message || "",
      stack: error.stack || "",
      controller: "reportController/getMySchoolReport"
    })

    res.status(500).json({ message: "Failed to fetch school report" });
  }
};

/**
 * Dynamic calculation of School Criteria Scorecards for current AY.
 * Updates marks dynamically:
 * - After submission: selfAssessedScore
 * - With reviewer marks: reviewScore
 * - With super reviewer marks: finalScore
 * - Final status: post appeal / completed
 */
async function buildLiveSchoolsReport(academicYear, schoolIdFilter = null) {
  const matchFilter = {
    academicYear,
    status: {
      $in: [
        "Draft",
        "Under Review",
        "Pending Final Approval",
        "Completed",
        "Appeal Submitted",
        "Appeal Closed",
      ],
    },
  };

  if (schoolIdFilter) {
    const mongoose = require("mongoose");
    matchFilter.school = new mongoose.Types.ObjectId(schoolIdFilter);
  }

  const results = await Submission.aggregate([
    { $match: matchFilter },
    { $unwind: "$partB.criteria" },
    { $unwind: "$partB.criteria.subCriteria" },
    { $unwind: "$partB.criteria.subCriteria.indicators" },
    {
      $group: {
        _id: {
          school: "$school",
          criteriaCode: "$partB.criteria.criteriaCode",
        },
        totalScore: {
          $sum: {
            $ifNull: [
              "$partB.criteria.subCriteria.indicators.finalScore",
              {
                $ifNull: [
                  "$partB.criteria.subCriteria.indicators.reviewScore",
                  {
                    $ifNull: [
                      "$partB.criteria.subCriteria.indicators.selfAssessedScore",
                      0,
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    },
    {
      $lookup: {
        from: "schools",
        localField: "_id.school",
        foreignField: "_id",
        as: "schoolInfo",
      },
    },
    { $unwind: "$schoolInfo" },
    { $sort: { "_id.criteriaCode": 1 } },
    {
      $project: {
        _id: 0,
        schoolId: "$_id.school",
        schoolName: "$schoolInfo.name",
        criteriaCode: "$_id.criteriaCode",
        totalScore: 1,
      },
    },
  ]);

  const schoolsMap = {};
  for (const row of results) {
    const { schoolId, schoolName, criteriaCode, totalScore } = row;
    const sId = schoolId.toString();

    if (!schoolsMap[sId]) {
      schoolsMap[sId] = {
        academicYear,
        schoolId,
        schoolName,
        criteria: [],
        finalScore: 0,
      };
    }

    const configKey = `C${criteriaCode}`;
    const config = CRITERIA_CONFIG[configKey];
    if (!config) continue;

    const percentage = config.maxMarks ? (totalScore / config.maxMarks) * 100 : 0;
    const weightedScore = (percentage * config.weightage) / 100;
    const grade = calculateGrade(percentage);

    schoolsMap[sId].criteria.push({
      code: criteriaCode,
      name: config.name,
      weightage: config.weightage,
      maxMarks: config.maxMarks,
      marksAwarded: Number(totalScore.toFixed(2)),
      percentage: Number(percentage.toFixed(2)),
      weightedScore: Number(weightedScore.toFixed(2)),
      grade: grade,
    });

    schoolsMap[sId].finalScore += weightedScore;
  }

  const structuredSchools = Object.values(schoolsMap).map((school) => {
    school.criteria.sort((a, b) => a.code.localeCompare(b.code));
    school.criteria.forEach((item, i) => (item.sNo = i + 1));
    const totalWeighted = Number(school.finalScore.toFixed(2));
    school.finalScore = {
      totalWeightedScore: totalWeighted,
      outOf: 100,
      grade: calculateGrade(totalWeighted),
    };
    return school;
  });

  // Sort by ranking
  structuredSchools.sort(
    (a, b) => b.finalScore.totalWeightedScore - a.finalScore.totalWeightedScore
  );

  return structuredSchools;
}

/**
 * @desc Get live criteria scorecard report for all schools (Admin, Superuser, QAA, Dev)
 * @route GET /api/reports/live-scorecard
 * @access Private (admin, superuser, qaa, developer)
 */
exports.getLiveSchoolCriteriaReport = async (req, res) => {
  try {
    const { academicYear } = req.query;

    if (!academicYear) {
      return res.status(400).json({ message: "academicYear is required" });
    }

    const schools = await buildLiveSchoolsReport(academicYear);

    return res.status(200).json({
      academicYear,
      schools,
      isLive: true,
    });
  } catch (error) {
    logger.error("Live Scorecard Error", {
      message: error.message || "",
      stack: error.stack || "",
      controller: "reportController/getLiveSchoolCriteriaReport",
    });
    res.status(500).json({ message: "Failed to generate live scorecard report" });
  }
};

/**
 * @desc Get live criteria scorecard for department's own school (Department)
 * @route GET /api/reports/my-school-live
 * @access Private (department)
 */
exports.getMySchoolLiveReport = async (req, res) => {
  try {
    const { academicYear } = req.query;
    const schoolId = req.user.school;

    if (!academicYear) {
      return res.status(400).json({ message: "academicYear is required" });
    }
    if (!schoolId) {
      return res.status(403).json({ message: "School not associated with user" });
    }

    const schools = await buildLiveSchoolsReport(academicYear, schoolId);
    const schoolData = schools.length > 0 ? schools[0] : null;

    if (!schoolData) {
      return res.status(404).json({
        message: "No submission data found for your school in this academic year",
      });
    }

    return res.status(200).json(schoolData);
  } catch (error) {
    logger.error("Error fetching my school live report", {
      message: error.message || "",
      stack: error.stack || "",
      controller: "reportController/getMySchoolLiveReport",
    });
    res.status(500).json({ message: "Failed to fetch school live report" });
  }
};