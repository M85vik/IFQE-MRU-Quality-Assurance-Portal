const ResultPublication = require("../models/ResultPublication");
const Submission = require("../models/Submission");
const CRITERIA_CONFIG = require("../config/criteriaConfig");
const SchoolResult = require('../models/SchoolResult')

exports.getPublicationStatus = async (req, res) => {
  const { academicYear } = req.query;

  const count = await Submission.countDocuments({
    academicYear,
    status: { $in: ["Completed", "Appeal Closed"] }
  });

  if (count === 0) {
    return res.status(200).json({
      academicYear,
      hasData: false,
      isPublished: false,
      publishedAt: null,
      message: "No submission found for this academic year"
    });
  }

  const record = await ResultPublication.findOne({ academicYear });

  res.status(200).json({
    academicYear,
    hasData: true,
    isPublished: record ? record.isPublished : false,
    publishedAt: record ? record.publishedAt : null
  });
};

async function buildSchoolsReportForYear(academicYear) {
  const results = await Submission.aggregate([
    {
      $match: {
        academicYear,
        status: { $in: ["Completed", "Appeal Closed"] },
      },
    },
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
                  "$partB.criteria.subCriteria.indicators.reviewerScore",
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

    {
      $sort: { "_id.criteriaCode": 1 },
    },

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

    if (!schoolsMap[schoolId]) {
      schoolsMap[schoolId] = {
        academicYear,
        schoolId,
        schoolName,
        criteria: [],
        finalScore: 0,
      };
    }

    const configKey = `C${criteriaCode}`;
    const config = CRITERIA_CONFIG[configKey];
    if (!config) {
      console.warn(
        `⚠ No config found for criteria ${criteriaCode} -> key ${configKey}`
      );
      continue;
    }

    const weightage = config.weightage;
    const maxMarks = config.maxMarks;

    const percentage = maxMarks ? (totalScore / maxMarks) * 100 : 0;
    const weightedScore = (percentage * weightage) / 100;

    schoolsMap[schoolId].criteria.push({
      sNo: schoolsMap[schoolId].criteria.length + 1,
      code: criteriaCode,
      name: config.name,
      weightage,
      maxMarks,
      marksAwarded: Number(totalScore.toFixed(2)),
      percentage: Number(percentage.toFixed(2)),
      weightedScore: Number(weightedScore.toFixed(2)),
    });

    schoolsMap[schoolId].finalScore += weightedScore;
  }

  // sort criteria and fix sNo
  for (const schoolId in schoolsMap) {
    const list = schoolsMap[schoolId].criteria;
    list.sort((a, b) => a.code.localeCompare(b.code));
    list.forEach((item, idx) => {
      item.sNo = idx + 1;
    });
  }

  // convert to array + fix finalScore format
  const schools = Object.values(schoolsMap).map((school) => ({
    ...school,
    finalScore: {
      totalWeightedScore: Number(school.finalScore.toFixed(2)),
      outOf: 100,
    },
  }));

  // sort by ranking
  schools.sort(
    (a, b) => b.finalScore.totalWeightedScore - a.finalScore.totalWeightedScore
  );

  return schools;
}


// exports.updatePublicationStatus = async (req, res) => {
//   const { academicYear, isPublished } = req.body;
//   const adminId = req.user?.id;

//   const count = await Submission.countDocuments({
//     academicYear,
//     status: { $in: ["Completed", "Appeal Closed"] }
//   });

//   if (count === 0) {
//     return res.status(400).json({
//       message: "Cannot publish — No completed submissions for this academic year"
//     });
//   }

//   const record = await ResultPublication.findOneAndUpdate(
//     { academicYear },
//     {
//       isPublished,
//       publishedAt: isPublished ? new Date() : null,
//       updatedBy: adminId
//     },
//     { upsert: true, new: true }
//   );

//   res.status(200).json({
//     message: isPublished
//       ? "Result Published successfully!"
//       : "Result Unpublished successfully!",
//     record
//   });
// };


exports.updatePublicationStatus = async (req, res) => {
  try {
    const { academicYear, isPublished } = req.body;
    const adminId = req.user?.id;

    const count = await Submission.countDocuments({
      academicYear,
      status: { $in: ["Completed", "Appeal Closed"] },
    });

    if (count === 0) {
      return res.status(400).json({
        message:
          "Cannot publish — No completed submissions for this academic year",
      });
    }

    // 🔹 When publishing → build snapshot + store in SchoolResult
    if (isPublished) {
      const schools = await buildSchoolsReportForYear(academicYear);

      // clear existing snapshot for that year (if any)
      await SchoolResult.deleteMany({ academicYear });

      // insert new snapshot
      if (schools.length > 0) {
        await SchoolResult.insertMany(schools);
      }
    }

    const record = await ResultPublication.findOneAndUpdate(
      { academicYear },
      {
        isPublished,
        publishedAt: isPublished ? new Date() : null,
        updatedBy: adminId,
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      message: isPublished
        ? "Results published & snapshot stored successfully!"
        : "Result Unpublished successfully!",
      record,
    });
  } catch (error) {
    console.error("Error updating publication:", error);
    return res
      .status(500)
      .json({ message: "Failed to update publication status" });
  }
};
