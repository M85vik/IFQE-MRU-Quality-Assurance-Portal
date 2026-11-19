const ResultPublication = require("../models/ResultPublication");
const Submission = require("../models/Submission");
const CRITERIA_CONFIG = require("../config/criteriaConfig");
const SchoolResult = require('../models/SchoolResult');
const logger = require("../utils/logger.js");
const { calculateGrade } = require("../utils/gradeHelper");
exports.getPublicationStatus = async (req, res) => {
  try {
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
  } catch (error) {

      logger.error(`Error Fetching Result Publication Status`, {
            message: error.message || "",
            stack: error.stack || "",
            controller: "resultPublicationController/getPublicationStatus"
        })
        res.status(400).json({ message: 'Error Fetching Result Publication Status', error: error.message });
    
  }
};

async function buildSchoolsReportForYear(academicYear) {
 try {
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
                   "$partB.criteria.subCriteria.indicators.reviewScore",
                   0,
                 ],
               },
             ],
           },
         },
         // Dynamic max marks: sum indicator-level max scores based on indicatorCode
         maxPossibleScore: {
           $sum: {
             $switch: {
               branches: [
                 {
                   case: {
                     $in: [
                       "$partB.criteria.subCriteria.indicators.indicatorCode",
                       ["3.1.2", "3.1.3", "3.1.5"]
                     ]
                   },
                   then: 0
                 },
                 {
                   case: { $regexMatch: { input: "$partB.criteria.subCriteria.indicators.indicatorCode", regex: "^2\\.3\\.\\d+$" } },
                   then: 12
                 },
                 {
                   case: { $eq: ["$partB.criteria.subCriteria.indicators.indicatorCode", "4.2.1"] },
                   then: 16
                 }
               ],
               default: 4
             }
           }
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
         maxPossibleScore: 1,
       },
     },
   ]);
 
   const schoolsMap = {};
 
   for (const row of results) {
     const { schoolId, schoolName, criteriaCode, totalScore, maxPossibleScore } = row;
 
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
     // Use dynamically calculated max marks from actual submission indicator data.
     // Falls back to criteriaConfig value only if no indicator data exists.
     const effectiveMaxMarks = maxPossibleScore > 0 ? maxPossibleScore : config.maxMarks;
 
     const percentageRaw = effectiveMaxMarks ? (totalScore / effectiveMaxMarks) * 100 : 0;
     const percentage = Number(percentageRaw.toFixed(2));
     const weightedScore = Number((Math.round(percentage * weightage) / 100).toFixed(2));
     const grade = calculateGrade(percentage);

     schoolsMap[schoolId].criteria.push({
       sNo: schoolsMap[schoolId].criteria.length + 1,
       code: criteriaCode,
       name: config.name,
       weightage,
       maxMarks: effectiveMaxMarks,
       marksAwarded: Number(totalScore.toFixed(2)),
       percentage: percentage,
       weightedScore: weightedScore,
       grade,
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
   const schools = Object.values(schoolsMap).map((school) => {
     const totalWeighted = Number(school.finalScore.toFixed(2));
     return {
       ...school,
       finalScore: {
         totalWeightedScore: totalWeighted,
         outOf: 100,
         grade: calculateGrade(totalWeighted),
       },
     };
   });
 
   // sort by ranking
   schools.sort(
     (a, b) => b.finalScore.totalWeightedScore - a.finalScore.totalWeightedScore
   );
 
   return schools;
 } catch (error) {

   logger.error(`Error Building School Report `, {
            message: error.message || "",
            stack: error.stack || "",
            controller: "resultPublicationController/buildSchoolsReportForYear"
        })
        res.status(400).json({ message: 'Error Building School Report ', error: error.message });
    
  
 }
}



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
    // console.error("Error updating publication:", error);

    logger.error(`Error Updating Publication Status `, {
            message: error.message || "",
            stack: error.stack || "",
            controller: "resultPublicationController/updatePublicationStatus"
        }) 

    return res
      .status(500)
      .json({ message: "Failed to update publication status" });
  }
};
