/**
 * @fileoverview This controller contains functions that perform complex data aggregation
 * using the MongoDB Aggregation Framework. These functions are designed to generate
 * analytics and performance reports from the submission data.
 * @module controllers/analyticsController
 */

const Submission = require('../models/Submission');
const mongoose = require('mongoose');

/**
 * @desc    Calculates the total final score for each school for a given academic year.
 * @route   GET /api/analytics/school-performance/:year
 * @access  Private (Admin/Superuser)
 */
const getSchoolPerformance = async (req, res) => {
    const { year } = req.params;
    try {
        const performance = await Submission.aggregate([
            // --- STAGE 1: Filter ---
            // Match only the documents relevant for the report:
            // - Must be for the specified academicYear.
            // - Must have a final status indicating scores are finalized.
            { $match: { 
                academicYear: year, 
                status: { $in: ['Completed', 'Appeal Submitted', 'Appeal Closed'] } 
            } },
            
            // --- STAGE 2-4: Deconstruct Arrays ---
            // Use $unwind to deconstruct the nested arrays. This creates a separate
            // document for EACH indicator within EACH submission.
            // For example, one submission with 100 indicators becomes 100 documents.
            { $unwind: "$partB.criteria" },
            { $unwind: "$partB.criteria.subCriteria" },
            { $unwind: "$partB.criteria.subCriteria.indicators" },

            // --- STAGE 5: Join with Schools Collection ---
            // Use $lookup (similar to a SQL LEFT JOIN) to fetch the school's name
            // using the 'school' ObjectId reference.
            { $lookup: {
                from: 'schools', // The collection to join with
                localField: 'school', // Field from the input documents (Submission)
                foreignField: '_id', // Field from the documents of the "from" collection (School)
                as: 'schoolDetails' // The name of the new array field to add
            }},

            // --- STAGE 6: Group and Calculate ---
            // Group all the individual indicator documents by school ID.
            { $group: {
                _id: "$school", // Group by the school's ObjectId
                // Get the school's name from the first document in each group.
                schoolName: { $first: { $arrayElemAt: ["$schoolDetails.name", 0] } },
                // Sum the scores for all indicators in the group.
                totalScore: { 
                    $sum: { 
                        // Use the finalScore if it exists, otherwise fall back to the reviewScore.
                        $ifNull: [ "$partB.criteria.subCriteria.indicators.finalScore", "$partB.criteria.subCriteria.indicators.reviewScore" ] 
                    } 
                }
            }},

            // --- STAGE 7: Sort ---
            // Sort the resulting school groups by their total score in descending order.
            { $sort: { totalScore: -1 } },

            // --- STAGE 8: Reshape Output ---
            // Clean up the output to be more user-friendly for the frontend.
            { $project: {
                _id: 0, // Exclude the default _id field
                schoolId: "$_id",
                schoolName: "$schoolName",
                finalScore: "$totalScore"
            }}
        ]);
        res.json(performance);
    } catch (error) {
        console.error("Error fetching school performance data:", error);
        res.status(500).json({ message: 'Error fetching school performance data' });
    }
};

/**
 * @desc    Calculates the performance of each department within a specific school for a given year.
 * @route   GET /api/analytics/department-performance/:schoolId/:year
 * @access  Private (Admin/Superuser)
 */
const getDepartmentPerformance = async (req, res) => {
    const { schoolId, year } = req.params;
    try {
        const departmentPerformance = await Submission.aggregate([
            // --- STAGE 1: Filter ---
            // Match submissions for the specific year, school, and with a finalized status.
            // Note: `school` must be cast to a mongoose ObjectId to match correctly.
            { $match: { 
                academicYear: year, 
                // IMPORTANT: This logic seems to be summing reviewScore. If you want final scores,
                // you should use the same status match as getSchoolPerformance.
                // Example: status: { $in: ['Completed', 'Appeal Closed'] }
                status: 'Approved', // Consider updating this status
                school: new mongoose.Types.ObjectId(schoolId) 
            } },

            // --- STAGE 2: Add Calculated Field ---
            // This pipeline calculates the total score differently. It sums the reviewScore
            // at the criterion level.
            { $addFields: { totalScore: { $sum: "$partB.criteria.reviewScore" } } },

            // --- STAGE 3: Group by Department ---
            // Group all submissions for a single department and calculate the average score.
            { $group: {
                _id: '$department',
                averageScore: { $avg: '$totalScore' }
            }},

            // --- STAGE 4: Join with Departments Collection ---
            // Fetch the department's name.
            { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'deptDetails' }},
            
            // --- STAGE 5: Reshape Output ---
            // Clean up the final document structure.
            { $project: {
                _id: 0,
                departmentId: '$_id',
                departmentName: { $arrayElemAt: ['$deptDetails.name', 0] },
                // Round the average score to two decimal places for cleaner display.
                finalScore: { $round: ["$averageScore", 2] }
            }},
            
            // --- STAGE 6: Sort ---
            // Sort departments by their final score in descending order.
            { $sort: { finalScore: -1 } }
        ]);
        res.json(departmentPerformance);
    } catch (error) {
        console.error("Error fetching department analytics:", error);
        res.status(500).json({ message: 'Error fetching department analytics' });
    }
};


/**
 * @desc    Compares the scores of all schools for each individual indicator in a given year.
 * @route   GET /api/analytics/indicator-comparison/:year
 * @access  Private (Admin/Superuser)
 */
const getIndicatorComparison = async (req, res) => {
    const { year } = req.params;
    try {
        const comparisonData = await Submission.aggregate([
            // --- STAGE 1: Filter ---
            // Initial filtering for relevant, completed submissions.
            { $match: { 
                academicYear: year, 
                status: { $in: ['Completed', 'Appeal Submitted', 'Appeal Closed'] } 
            } },
            
            // --- STAGE 2-4: Deconstruct ---
            // Unwind down to the indicator level, creating one document per indicator per submission.
            { $unwind: "$partB.criteria" },
            { $unwind: "$partB.criteria.subCriteria" },
            { $unwind: "$partB.criteria.subCriteria.indicators" },
            
            // --- STAGE 5: Join with Schools ---
            // Fetch the school name for each indicator document.
            { $lookup: {
                from: 'schools',
                localField: 'school',
                foreignField: '_id',
                as: 'schoolDetails'
            }},
            
            // --- STAGE 6: Group by Indicator Code ---
            // This is the core of the comparison logic. All entries for the same indicator (e.g., "1.1.1")
            // from different submissions are grouped together.
            { $group: {
                _id: "$partB.criteria.subCriteria.indicators.indicatorCode",
                // Get the indicator's title from the first document in the group.
                title: { $first: "$partB.criteria.subCriteria.indicators.title" },
                // Create an array of scores for this indicator.
                scores: {
                    $push: { // $push adds an element to an array
                        schoolName: { $arrayElemAt: ["$schoolDetails.name", 0] },
                        score: {
                           $ifNull: [ "$partB.criteria.subCriteria.indicators.finalScore", "$partB.criteria.subCriteria.indicators.reviewScore" ] 
                        }
                    }
                }
            }},
            
            // --- STAGE 7: Sort ---
            // Sort the final results by indicator code (1.1.1, 1.1.2, etc.).
            { $sort: { "_id": 1 } },
            
            // --- STAGE 8: Reshape Output ---
            // Format the final JSON structure for the frontend.
            { $project: {
                _id: 0,
                indicatorCode: "$_id",
                indicatorTitle: "$title",
                schoolScores: "$scores"
            }}
        ]);
        
        res.json(comparisonData);
    } catch (error) {
        console.error("Error fetching indicator comparison data:", error);
        res.status(500).json({ message: 'Error fetching indicator comparison data' });
    }
};

module.exports = { getSchoolPerformance, getDepartmentPerformance, getIndicatorComparison };