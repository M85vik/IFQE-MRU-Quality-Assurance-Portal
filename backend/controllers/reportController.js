
const Submission = require("../models/Submission");
const ResultPublication = require("../models/ResultPublication");
const SchoolResult = require("../models/SchoolResult");
const CRITERIA_CONFIG = require("../config/criteriaConfig");

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
      return res.status(200).json({
        academicYear,
        schools: savedResults,
        source: "stored"
      });
    }

    console.log("⚠ No stored snapshot found — regenerating from submissions...");

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
                    "$partB.criteria.subCriteria.indicators.reviewerScore",
                    {
                      $ifNull: [
                        "$partB.criteria.subCriteria.indicators.selfAssessedScore",
                        0
                      ]
                    }
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

      schoolsMap[schoolId].criteria.push({
        code: criteriaCode,
        name: config.name,
        weightage: config.weightage,
        maxMarks: config.maxMarks,
        marksAwarded: Number(totalScore.toFixed(2)),
        percentage: Number(percentage.toFixed(2)),
        weightedScore: Number(weightedScore.toFixed(2))
      });

      schoolsMap[schoolId].finalScore += weightedScore;
    }

    const structuredSchools = Object.values(schoolsMap).map((school) => {
      // sort criteria
      school.criteria.sort((a, b) => a.code.localeCompare(b.code));
      // add S.No
      school.criteria.forEach((item, i) => (item.sNo = i + 1));
      school.finalScore = {
        totalWeightedScore: Number(school.finalScore.toFixed(2)),
        outOf: 100
      };
      return school;
    });

    // Save fresh snapshot for future
    if (structuredSchools.length > 0) {
      await SchoolResult.insertMany(structuredSchools);
      console.log("🔥 Fresh SchoolResult snapshot saved for", academicYear);
    }

    return res.status(200).json({
      academicYear,
      schools: structuredSchools,
      source: "fresh"
    });

  } catch (error) {
    console.error("Report Error:", error);
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

   
    

    return res.status(200).json(result);

  } catch (error) {
    console.error("Error fetching my school report:", error);
    res.status(500).json({ message: "Failed to fetch school report" });
  }
};