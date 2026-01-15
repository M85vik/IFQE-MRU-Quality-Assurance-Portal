/**
 * @fileoverview This controller handles all logic related to submissions,
 * including creation, updates based on user roles, and various retrieval methods
 * for different parts of the application workflow. 
 * @module controllers/submissionController
 */


// --- Model Imports ---
const Submission = require('../models/Submission');
const Indicator = require('../models/Indicator');
const User = require('../models/User');
const SubmissionWindow = require('../models/SubmissionWindow');


// --- Service & Utility Imports ---
const { createSubmissionArchive } = require('../utils/archiveService');
const { DeleteObjectCommand, DeleteObjectsCommand } = require('@aws-sdk/client-s3');

const s3Client = require('../config/s3Client');


const logActivity = require("../utils/logActivity.js")

require('../models/School');
require('../models/Department');


// --- HELPER FUNCTIONS ---

/**
 * Deletes an object from the S3 bucket. This is used to clean up orphaned files
 * when a user uploads a new version, replacing an old one.
 * @param {string} key - The S3 object key (filename) to delete.
 */
const deleteS3Object = async (key) => {
    // If no key is provided, do nothing.
    if (!key) return;
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
        });
        await s3Client.send(command);
        console.log(`Successfully deleted orphaned file: ${key} from S3.`);
    } catch (error) {
        // We log the error but don't throw it, as failing to delete an old file
        // should not block the main update operation.
        console.error(`Failed to delete file ${key} from S3:`, error);
    }
};

/**
 * Checks if the main submission window for a given academic year is currently open.
 * @param {string} academicYear - The academic year to check (e.g., "2023-2024").
 * @returns {Promise<boolean>} - True if the window is open, false otherwise.
 */
const isSubmissionWindowOpen = async (academicYear) => {
    // Correctly query for a 'Submission' type window to distinguish it from an 'Appeal' window.
    const window = await SubmissionWindow.findOne({ academicYear, windowType: 'Submission' });
    if (!window) return false;

    const now = new Date();
    // Check if the current time is between the window's start and end dates.
    return now >= window.startDate && now <= window.endDate;
};


// --- CONTROLLER FUNCTIONS ---

/**
 * @desc    Create a new, empty submission for the logged-in department user.
 *          It pre-populates the submission structure based on all existing indicators.
 * @route   POST /api/submissions
 * @access  Private (Department users)
 */
const createSubmission = async (req, res) => {
    const { academicYear, title, submissionType } = req.body;
    const user = req.user;
    //Add here logic if submission for that year already exist submission should not be allowed 

    // 1. Authorization & Validation
    const windowOpen = await isSubmissionWindowOpen(academicYear);
    if (!windowOpen) {
        return res.status(403).json({ message: `The submission window for the academic year ${academicYear} is currently closed.` });
    }

    if (!academicYear || !title) {
        return res.status(400).json({ message: 'Academic Year and Title are required.' });
    }

    // Fetch the full user details, including populated school and department.
    const fullUser = await User.findById(req.user._id).populate('school').populate('department');
    if (!fullUser || !fullUser.department || !fullUser.school) {
        return res.status(400).json({ message: 'User is not correctly associated with a department and school.' });
    }

    // Prevent duplicate submissions with the same title for the same department and year.
    // const existingSubmission = await Submission.findOne({
    //     department: fullUser.department._id,
    //     academicYear,
    //     title,
    // });
    // if (existingSubmission) {
    //     return res.status(400).json({ message: `A submission with this title for ${academicYear} already exists.` });
    // }

    // Prevent duplicate submissions for the same department and academic year
    const existingSubmission = await Submission.findOne({
        department: fullUser.department._id,
        academicYear,
    });

    if (existingSubmission) {
        return res.status(400).json({
            message: `Your department has already created a submission for the academic year ${academicYear}. Multiple submissions for the same year are not allowed.`,
        });
    }


    // 2. Data Preparation: Build the submission structure
    const allIndicators = await Indicator.find({}).sort('indicatorCode');
    if (allIndicators.length === 0) {
        return res.status(500).json({ message: 'Indicators not found. Please seed the database.' });
    }

    // Hardcoded dictionaries for human-readable titles. These could be moved to a config file.
    const criteriaTitles = {
        "1": "ACADEMIC EXCELLENCE & PEDAGOGY",
        "2": "RESEARCH, INNOVATION & IMPACT",
        "3": "STUDENT LIFECYCLE & ENGAGEMENT",
        "4": "FACULTY DEVELOPMENT AND DIVERSITY",
        "5": "INSTITUTIONAL GOVERNANCE & STRATEGIC VISION",
        "6": "GLOBAL ENGAGEMENT & COLLABORATIONS",
        "7": "STAKEHOLDER INSIGHTS & CONTINUOUS IMPROVEMENT",
    };
    const subCriteriaTitles = {
        "1.1": "CURRICULUM DESIGN", "1.2": "PEDAGOGICAL INNOVATION", "1.3": "DIGITIZATION", "1.4": "CONTINUOUS ASSESSMENT METHODOLOGY", "1.5": "PERFORMANCE AND EVALUATION ANALYSIS", "1.6": "ATTAINMENT OF COURSE OUTCOMES",
        "2.1": "RESEARCH PUBLICATIONS", "2.2": "PATENTS", "2.3": "RESEARCH GRANTS/PROJECTS", "2.4": "CONSULTANCY AND MDPS", "2.5": "START-UPS", "2.6": "RESEARCH INFRASTRUCTURE", "2.7": "INTERDISCIPLINARY RESEARCH", "2.8": "PH.D. PROGRAM",
        "3.1": "ADMISSION", "3.2": "INDUCTION PROGRAM FOR STUDENTS", "3.3": "IMPLEMENTATION OF MENTOR-MENTEE", "3.4": "TRAINING/WORKSHOPS/SEMINARS", "3.5": "STUDENT CLUBS", "3.6": "INDUSTRY INTERACTION", "3.7": "PLACEMENTS & PROGRESSION", "3.8": "INTERNSHIPS", "3.9": "STUDENT CONTRIBUTION", "3.10": "ALUMNI CONTRIBUTION",
        "4.1": "FACULTY STRENGTH & QUALITY", "4.2": "FACULTY CONTRIBUTION",
        "5.1": "INSTITUTIONAL GOVERNANCE & STRATEGIC VISION",
        "6.1": "MOU'S (MEMORANDUM OF UNDERSTANDING)", "6.2": "EXCHANGE PROGRAMS", "6.3": "INTERNATIONAL COLLABORATIONS", "6.4": "ENGAGEMENT IN GLOBAL ACADEMIC PLATFORMS", "6.5": "SEMINARS/LECTURES BY INTERNATIONAL SPEAKERS",
        "7.1": "NET PROMOTER SCORE",
    };

    // Use a Map for efficient grouping of indicators into criteria and sub-criteria.
    // This is much faster than nested loops for large numbers of indicators.
    const criteriaMap = new Map();
    allIndicators.forEach(indicator => {
        // Create criterion entry if it doesn't exist.
        if (!criteriaMap.has(indicator.criterionCode)) {
            criteriaMap.set(indicator.criterionCode, {
                criteriaCode: indicator.criterionCode,
                title: criteriaTitles[indicator.criterionCode] || `Criterion ${indicator.criterionCode}`,
                subCriteria: new Map(),
            });
        }
        const criterion = criteriaMap.get(indicator.criterionCode);
        // Create sub-criterion entry if it doesn't exist.
        if (!criterion.subCriteria.has(indicator.subCriterionCode)) {
            criterion.subCriteria.set(indicator.subCriterionCode, {
                subCriteriaCode: indicator.subCriterionCode,
                title: subCriteriaTitles[indicator.subCriterionCode] || `Sub-Criterion ${indicator.subCriterionCode}`,
                indicators: [],
            });
        }
        const subCriterion = criterion.subCriteria.get(indicator.subCriterionCode);
        // Add the indicator to the structure.
        subCriterion.indicators.push({
            indicatorCode: indicator.indicatorCode,
            title: indicator.title,
            fileKey: null,
        });
    });

    // Convert the Maps back into nested arrays for the final schema structure.
    const finalPartB = Array.from(criteriaMap.values()).map(crit => ({
        ...crit,
        subCriteria: Array.from(crit.subCriteria.values()),
    }));

    // Define the default structure for Part A.
    const partAItems = [
        { code: "1", title: "About the University (Word limit: 350-500 words)" },
        { code: "2", title: "About the School (Word limit: 350 - 500 words)" },
        { code: "3", title: "Vision: School vision statement" },
        { code: "4", title: "Mission: School mission statement" },
        { code: "5", title: "Alignment of School Vision Mission with University (300 - 500 words)" },
        { code: "6", title: "SWOC Analysis (Detailed description)" },
        { code: "7", title: "Strategic Plan (CAY) (Goals & Roadmap - Execution details)" },
        { code: "8", title: "Best practices" },
    ];

    // 3. Document Creation
    const submission = new Submission({
        title,
        submissionType: submissionType || 'Annual',
        submittedBy: fullUser._id,
        department: fullUser.department._id,
        school: fullUser.school._id,
        academicYear,
        partA: { items: partAItems.map(item => ({ ...item, fileKey: null })) },
        partB: { criteria: finalPartB },
    });

    // 4. Save to Database
    try {
        const createdSubmission = await submission.save();

        try {
            await logActivity(
                user,
                'Create Submission',
                `Submission ID: ${user._id}, Department: ${submission.department}`,
                submission.academicYear,
                req.ip
            );

            console.log("LOG REGISTERED");

        } catch (logError) {
            console.warn(`⚠️ Activity log failed for submission ${req.params.id}:`, logError.message);
        }

        res.status(201).json(createdSubmission);
    } catch (error) {
        res.status(400).json({ message: 'Error creating submission', error: error.message });
    }
};

/**
 * @desc    Update a submission. Logic is heavily branched based on the user's role.
 * @route   PUT /api/submissions/:id
 * @access  Private (Department, QAA, Superuser)
 */
// const updateSubmission = async (req, res) => {
//     try {
//         const submission = await Submission.findById(req.params.id).populate('school department');
//         if (!submission) {
//             return res.status(404).json({ message: 'Submission not found' });
//         }

//         const { role } = req.user;
//         const { partA, partB, status, appeal } = req.body;
//         const oldFileKeys = []; // Collect files to delete AFTER successful DB save

//         // ==========================
//         // 🚀 DEPARTMENT UPDATE LOGIC
//         // ==========================
//         if (role === 'department') {
//             const windowOpen = await isSubmissionWindowOpen(submission.academicYear);
//             if (!windowOpen) {
//                 return res.status(403).json({ message: `Submission window for ${submission.academicYear} is closed.` });
//             }
//             if (submission.status !== 'Draft') {
//                 return res.status(403).json({ message: 'Submission is locked for editing.' });
//             }

//             // ---- PART A ----
//             if (partA && partA.summaryFileKey !== submission.partA.summaryFileKey) {
//                 if (submission.partA.summaryFileKey) {
//                     oldFileKeys.push(submission.partA.summaryFileKey);
//                 }
//                 submission.partA.summaryFileKey = partA.summaryFileKey;
//                 submission.markModified('partA');
//             }

//             // ---- PART B ----
//             if (partB?.criteria) {
//                 for (const reqCrit of partB.criteria) {
//                     const dbCrit = submission.partB.criteria.find(c => c.criteriaCode === reqCrit.criteriaCode);
//                     if (!dbCrit) continue;

//                     for (const reqSub of reqCrit.subCriteria) {
//                         const dbSub = dbCrit.subCriteria.find(sc => sc.subCriteriaCode === reqSub.subCriteriaCode);
//                         if (!dbSub) continue;

//                         for (const reqInd of reqSub.indicators) {
//                             const dbInd = dbSub.indicators.find(i => i.indicatorCode === reqInd.indicatorCode);
//                             if (!dbInd) continue;

//                             // --- MAIN FILE ---
//                             if (reqInd.fileKey !== dbInd.fileKey) {
//                                 if (dbInd.fileKey && reqInd.fileKey) {
//                                     oldFileKeys.push(dbInd.fileKey);
//                                 }
//                                 dbInd.fileKey = reqInd.fileKey; // can be null or string
//                             }

//                             // --- EVIDENCE LINK FILE ---
//                             if (reqInd.evidenceLinkFileKey !== dbInd.evidenceLinkFileKey) {
//                                 if (dbInd.evidenceLinkFileKey && reqInd.evidenceLinkFileKey) {
//                                     oldFileKeys.push(dbInd.evidenceLinkFileKey);
//                                 }
//                                 dbInd.evidenceLinkFileKey = reqInd.evidenceLinkFileKey;
//                             }
//                         }
//                     }
//                 }

//                 submission.markModified('partB');
//             }

//             if (status === 'Under Review') submission.status = 'Under Review';

//             const updatedSubmission = await submission.save();

//             // Only delete after DB update is successful
//             for (const key of oldFileKeys) {
//                 await deleteS3Object(key);
//             }

//             return res.json(updatedSubmission);
//         }

//         // ==========================
//         // 🧐 QAA UPDATE LOGIC
//         // ==========================
//         if (role === 'qaa') {
//             if (submission.status !== 'Under Review') {
//                 return res.status(403).json({ message: 'Not allowed. Submission not under review.' });
//             }

//             if (partB?.criteria) {
//                 submission.partB.criteria.forEach(dbCrit => {
//                     const reqCrit = partB.criteria.find(c => c.criteriaCode === dbCrit.criteriaCode);
//                     if (!reqCrit) return;
//                     dbCrit.reviewScore = reqCrit.reviewScore;
//                     dbCrit.subCriteria.forEach(dbSub => {
//                         const reqSub = reqCrit.subCriteria.find(sc => sc.subCriteriaCode === dbSub.subCriteriaCode);
//                         if (!reqSub) return;
//                         dbSub.remark = reqSub.remark;
//                         dbSub.indicators.forEach(dbInd => {
//                             const reqInd = reqSub.indicators.find(i => i.indicatorCode === dbInd.indicatorCode);
//                             if (!reqInd) return;
//                             dbInd.reviewScore = reqInd.reviewScore;
//                             dbInd.reviewRemark = reqInd.reviewRemark;
//                         });
//                     });
//                 });
//                 submission.markModified('partB');
//             }

//             if (status === 'Pending Final Approval') submission.status = status;
//             const updated = await submission.save();
//             return res.json(updated);
//         }

//         // ==========================
//         // 👑 SUPERUSER UPDATE LOGIC
//         // ==========================
//         if (role === 'superuser') {
//             if (!['Pending Final Approval', 'Appeal Submitted'].includes(submission.status)) {
//                 return res.status(403).json({ message: 'Submission not ready for final decision.' });
//             }

//             if (submission.status === 'Appeal Submitted') {
//                 appeal.indicators.forEach(ai => {
//                     submission.partB.criteria.forEach(c =>
//                         c.subCriteria.forEach(sc => {
//                             const ind = sc.indicators.find(i => i.indicatorCode === ai.indicatorCode);
//                             if (ind) ind.finalScore = ai.finalScore;
//                         })
//                     );
//                     const dbAI = submission.appeal.indicators.find(i => i.indicatorCode === ai.indicatorCode);
//                     if (dbAI) dbAI.superuserDecisionComment = ai.superuserDecisionComment;
//                 });

//                 submission.status = 'Appeal Closed';
//                 submission.appeal.status = 'Closed';
//                 submission.appeal.closedOn = new Date();

//                 if (!submission.archiveFileKey) {
//                     submission.archiveFileKey = await createSubmissionArchive(submission);
//                 }

//             } else {
//                 partB.criteria.forEach(reqCrit => {
//                     const dbCrit = submission.partB.criteria.find(c => c.criteriaCode === reqCrit.criteriaCode);
//                     if (!dbCrit) return;
//                     dbCrit.finalScore = reqCrit.finalScore;
//                     reqCrit.subCriteria.forEach(reqSub => {
//                         const dbSub = dbCrit.subCriteria.find(sc => sc.subCriteriaCode === reqSub.subCriteriaCode);
//                         if (!dbSub) return;
//                         dbSub.superuserRemark = reqSub.superuserRemark;
//                         reqSub.indicators.forEach(reqInd => {
//                             const dbInd = dbSub.indicators.find(i => i.indicatorCode === reqInd.indicatorCode);
//                             if (dbInd) {
//                                 dbInd.finalScore = reqInd.finalScore;
//                                 dbInd.superuserRemark = reqInd.superuserRemark;
//                             }
//                         });
//                     });
//                 });

//                 submission.status = 'Completed';
//                 submission.archiveFileKey = await createSubmissionArchive(submission);
//             }

//             submission.markModified('partB');
//             submission.markModified('appeal');

//             const updated = await submission.save();
//             return res.json(updated);
//         }

//         return res.status(403).json({ message: 'Unauthorized action' });

//     } catch (error) {
//         console.error("❌ Error in updateSubmission:", error);
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };


const updateSubmission = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id).populate('school department');
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        const { role } = req.user;
        const { partA, partB, status, appeal } = req.body;

        // --------------------------------------------------
        // DEPARTMENT LOGIC — Only allowed in Draft
        // --------------------------------------------------
        if (role === 'department') {
            const windowOpen = await isSubmissionWindowOpen(submission.academicYear);
            if (!windowOpen) {
                return res.status(403).json({
                    message: `Submission window for academic year ${submission.academicYear} is closed`
                });
            }
            if (submission.status !== 'Draft') {
                return res.status(403).json({
                    message: 'Cannot edit – already submitted for review'
                });
            }

            const oldFileKeys = [];

            // PART A update
            if (partA) {
                if (
                    submission.partA.summaryFileKey &&
                    submission.partA.summaryFileKey !== partA.summaryFileKey
                ) {
                    oldFileKeys.push(submission.partA.summaryFileKey);
                }

                submission.partA.summaryFileKey = partA.summaryFileKey;
                submission.markModified('partA');
            }

            // PART B update
            if (partB?.criteria) {
                for (const reqCriterion of partB.criteria) {
                    const dbCriterion = submission.partB.criteria.find(
                        c => c.criteriaCode === reqCriterion.criteriaCode
                    );
                    if (!dbCriterion) continue;

                    for (const reqSub of reqCriterion.subCriteria) {
                        const dbSub = dbCriterion.subCriteria.find(
                            sc => sc.subCriteriaCode === reqSub.subCriteriaCode
                        );
                        if (!dbSub) continue;

                        for (const reqInd of reqSub.indicators) {
                            const dbInd = dbSub.indicators.find(
                                i => i.indicatorCode === reqInd.indicatorCode
                            );
                            if (!dbInd) continue;

                            // FILE KEY update
                            if (reqInd.fileKey && reqInd.fileKey !== dbInd.fileKey) {
                                if (dbInd.fileKey) oldFileKeys.push(dbInd.fileKey);
                                dbInd.fileKey = reqInd.fileKey;
                            }

                            // EVIDENCE LINK update
                            if (reqInd.evidenceLinkFileKey && reqInd.evidenceLinkFileKey !== dbInd.evidenceLinkFileKey) {
                                if (dbInd.evidenceLinkFileKey) oldFileKeys.push(dbInd.evidenceLinkFileKey);
                                dbInd.evidenceLinkFileKey = reqInd.evidenceLinkFileKey;
                            }

                            // ⭐ Save self score
                            if (reqInd.selfAssessedScore !== undefined && reqInd.selfAssessedScore !== null) {
                                dbInd.selfAssessedScore = reqInd.selfAssessedScore;
                            }
                        }
                    }
                }
                submission.markModified('partB');
            }

            if (status === 'Under Review') {
                submission.status = 'Under Review';
            }

            const updatedSubmission = await submission.save();

            // AFTER successful DB save → delete old files
            for (const key of oldFileKeys) {
                await deleteS3Object(key);
            }

            return res.json(updatedSubmission);
        }

        // --------------------------------------------------
        // QAA REVIEWER — Score + Remark only
        // --------------------------------------------------
        if (role === 'qaa') {
            if (submission.status !== 'Under Review') {
                return res.status(403).json({ message: 'Not under review currently' });
            }

            if (partB?.criteria) {
                for (const reqCriterion of partB.criteria) {
                    const dbCriterion = submission.partB.criteria.find(
                        c => c.criteriaCode === reqCriterion.criteriaCode
                    );
                    if (!dbCriterion) continue;

                    dbCriterion.reviewScore = reqCriterion.reviewScore;

                    for (const reqSub of reqCriterion.subCriteria) {
                        const dbSub = dbCriterion.subCriteria.find(
                            sc => sc.subCriteriaCode === reqSub.subCriteriaCode
                        );
                        if (!dbSub) continue;

                        dbSub.remark = reqSub.remark;

                        for (const reqInd of reqSub.indicators) {
                            const dbInd = dbSub.indicators.find(
                                i => i.indicatorCode === reqInd.indicatorCode
                            );
                            if (!dbInd) continue;

                            dbInd.reviewScore = reqInd.reviewScore;
                            dbInd.reviewRemark = reqInd.reviewRemark;
                        }
                    }
                }
                submission.markModified('partB');
            }

            if (status === 'Pending Final Approval') {
                submission.status = 'Pending Final Approval';
            }

            const updatedSubmission = await submission.save();
            return res.json(updatedSubmission);
        }

        // --------------------------------------------------
        // SUPERUSER — Final Score + Archive generation
        // --------------------------------------------------
        if (role === 'superuser') {
            if (!['Pending Final Approval', 'Appeal Submitted'].includes(submission.status)) {
                return res.status(403).json({
                    message: 'Not eligible for final approval'
                });
            }

            if (submission.status === 'Appeal Submitted') {
                // Appeal finalization
                for (const appealed of appeal.indicators) {
                    submission.partB.criteria.forEach(c =>
                        c.subCriteria.forEach(sc => {
                            const dbInd = sc.indicators.find(i => i.indicatorCode === appealed.indicatorCode);
                            if (dbInd) dbInd.finalScore = appealed.finalScore;
                        })
                    );

                    const dbAppealInd = submission.appeal.indicators.find(i => i.indicatorCode === appealed.indicatorCode);
                    if (dbAppealInd) {
                        dbAppealInd.superuserDecisionComment = appealed.superuserDecisionComment;
                    }
                }

                submission.status = 'Appeal Closed';
                submission.appeal.status = 'Closed';
                submission.appeal.closedOn = new Date();

              
            } else {
                // Final approval
                for (const reqCriterion of partB.criteria) {
                    const dbCriterion = submission.partB.criteria.find(
                        c => c.criteriaCode === reqCriterion.criteriaCode
                    );
                    if (!dbCriterion) continue;

                    dbCriterion.finalScore = reqCriterion.finalScore;

                    for (const reqSub of reqCriterion.subCriteria) {
                        const dbSub = dbCriterion.subCriteria.find(
                            sc => sc.subCriteriaCode === reqSub.subCriteriaCode
                        );
                        if (!dbSub) continue;

                        dbSub.superuserRemark = reqSub.superuserRemark;

                        for (const reqInd of reqSub.indicators) {
                            const dbInd = dbSub.indicators.find(i => i.indicatorCode === reqInd.indicatorCode);
                            if (!dbInd) continue;

                            dbInd.finalScore = reqInd.finalScore;
                            dbInd.superuserRemark = reqInd.superuserRemark;
                        }
                    }
                }

                submission.status = 'Completed';
                submission.archive = {
                    status: 'Not Generated'
                };
            }

            submission.markModified('partB');
            submission.markModified('appeal');

            const updatedSubmission = await submission.save();
            return res.json(updatedSubmission);
        }

        return res.status(403).json({ message: 'Unauthorized action' });

    } catch (error) {
        console.error("Error in updateSubmission:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


/**
 * @desc    Get all submissions for the logged-in user's department.
 * @route   GET /api/submissions/my-department
 * @access  Private (Department users)
 */
const getMyDepartmentSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ department: req.user.department }).sort({ academicYear: -1 });

        // Post-process submissions to add a calculated totalFinalScore for completed reports.
        const processedSubmissions = submissions.map(sub => {
            const submissionObject = sub.toObject();
            let totalFinalScore = 0;
            let isScored = false;

            if (['Completed', 'Appeal Closed', 'Approved'].includes(submissionObject.status)) {
                isScored = true;
                submissionObject.partB.criteria.forEach(criterion => {
                    criterion.subCriteria.forEach(subCriterion => {
                        subCriterion.indicators.forEach(indicator => {
                            // Use final score if available, otherwise fallback to review score.
                            const score = indicator.finalScore ?? indicator.reviewScore;
                            if (typeof score === 'number') {
                                totalFinalScore += score;
                            }
                        });
                    });
                });
            }

            // Return the submission object with the new calculated property.
            return {
                ...submissionObject,
                totalFinalScore: isScored ? totalFinalScore : null,
            };
        });

        res.json(processedSubmissions);
    } catch (error) {
        console.error("Error fetching department submissions:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

/**
 * @desc    Get all submissions with status 'Under Review' for QAA users.
 * @route   GET /api/submissions/review-queue
 * @access  Private (QAA, Admin, Superuser)
 */
const getSubmissionsForReview = async (req, res) => {
    try {
        const { academicYear, school, department } = req.query;

        const reviewerSchool = req.user?.school;

        if (!reviewerSchool) {
            return res.status(403).json({ message: "Reviewer does not have a school assigned." });
        }


        // Base filter for submissions that are ready for review.
        const filter = {
            status: 'Under Review',
            school: reviewerSchool,
            department: { $ne: null }
        };

        // Add optional query parameters to the filter.
        if (academicYear) filter.academicYear = academicYear;


        const submissions = await Submission.find(filter)
            .populate('school', 'name')
            .populate('department', 'name')
            .sort({ updatedAt: 1 }); // Show oldest submissions first.

        // Data integrity check: filter out any submissions that have broken school/department references.
        const validSubmissions = submissions.filter(s => s.school && s.department);
        res.json(validSubmissions);
    } catch (error) {
        console.error("Error fetching review queue:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

/**
 * @desc    Get all completed/approved submissions.
 * @route   GET /api/submissions/approved
 * @access  Private (All authenticated users)
 */
const getApprovedSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({
            status: { $in: ['Completed', 'Appeal Closed', 'Approved'] } // 'Approved' is legacy, keeping for compatibility.
        })
            .populate('school', 'name')
            .populate('department', 'name')
            .sort({ academicYear: -1, updatedAt: -1 }); // Show newest first.
        res.json(submissions);
    } catch (error) {
        console.error("Error fetching approved submissions:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

/**
 * @desc    Get a single submission by its ID.
 * @route   GET /api/submissions/:id
 * @access  Private (Owner department, QAA, Admin, Superuser)
 */
const getSubmissionById = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate('school', 'name')
            .populate('department', 'name');

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Data integrity check to prevent crashes on the frontend.
        if (!submission.school || !submission.department) {
            return res.status(404).json({ message: 'Submission data is inconsistent and cannot be loaded.' });
        }

        // Authorization check: User must be an admin/reviewer or belong to the submission's department.
        const isOwner = submission.department._id.toString() === req.user.department?.toString();
        const isAdminOrReviewer = ['qaa', 'admin', 'superuser'].includes(req.user.role);
        if (!isOwner && !isAdminOrReviewer) {
            return res.status(403).json({ message: 'Not authorized to view this submission' });
        }

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: "An unexpected server error occurred." });
    }
};

/**
 * @desc    Get submissions awaiting superuser action (final approval or appeal review).
 * @route   GET /api/submissions/superuser-queue
 * @access  Private (Superuser)
 */
const getSubmissionsForSuperuser = async (req, res) => {
    try {
        const submissions = await Submission.find({
            status: { $in: ['Pending Final Approval', 'Appeal Submitted'] }
        })
            .populate('school', 'name')
            .populate('department', 'name')
            .sort({ status: 1, updatedAt: 1 }); // Sort to prioritize approvals, then by oldest.
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Submit an appeal for a completed submission.
 * @route   POST /api/submissions/:id/appeal
 * @access  Private (Department user)
 */
const submitAppeal = async (req, res) => {

    try {
        const { indicators } = req.body;
        const submission = await Submission.findById(req.params.id);

        // --- Validation Chain ---
        if (!submission) return res.status(404).json({ message: 'Submission not found' });
        if (submission.department.toString() !== req.user.department.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (submission.status !== 'Completed') {
            return res.status(400).json({ message: 'Only completed submissions can be appealed.' });
        }
        if (submission.hasAppealed) {
            return res.status(400).json({ message: 'This submission has already been appealed once.' });
        }

        // Business Rule: Check if the specific 'Appeal' window is open for this academic year.
        const appealWindow = await SubmissionWindow.findOne({
            academicYear: submission.academicYear,
            windowType: 'Appeal'
        });

        const now = new Date();
        if (!appealWindow || !(now >= appealWindow.startDate && now <= appealWindow.endDate)) {
            return res.status(403).json({ message: `The appeal window for the academic year ${submission.academicYear} is currently closed.` });
        }

        // --- Update Submission State ---
        submission.status = 'Appeal Submitted';
        submission.appeal.status = 'Submitted';
        submission.appeal.requestedOn = new Date();
        submission.appeal.indicators = indicators;
        submission.hasAppealed = true; // Flag to prevent multiple appeals.

        await submission.save();
        res.json({ message: 'Appeal submitted successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Server error while submitting appeal.' });
    }
};





/**
 * @desc Delete a submission and all related S3 files atomically.
 * @route DELETE /api/submissions/:id
 * @access Private (Admin, Superuser)
 */

const deleteSubmission = async (req, res) => {
    try {
        const user = req.user;
        console.log(`🗑️ Deletion requested for submission ID: ${req.params.id} by user ${req.user?.email}`);

        // 1️⃣ Find submission
        const submission = await Submission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // 2️⃣ Collect all S3 file keys
        const fileKeys = [];

        // Part A
        if (submission.partA?.summaryFileKey) fileKeys.push({ Key: submission.partA.summaryFileKey });
        submission.partA?.items?.forEach(item => item.fileKey && fileKeys.push({ Key: item.fileKey }));

        // Part B
        submission.partB?.criteria?.forEach(criteria => {
            criteria.subCriteria?.forEach(sub => {
                sub.indicators?.forEach(ind => {
                    if (ind.fileKey) fileKeys.push({ Key: ind.fileKey });
                    if (ind.evidenceLinkFileKey) fileKeys.push({ Key: ind.evidenceLinkFileKey });
                });
            });
        });

        // Archive
        if (submission.archiveFileKey) fileKeys.push({ Key: submission.archiveFileKey });



        //after new archive logics 
           // 🆕 New archive system
    if (submission.archive?.fileKey) {
      fileKeys.push({ Key: submission.archive.fileKey });
    }

        console.log(`🧾 Found ${fileKeys.length} files to delete from S3.`);

        // 3️⃣ Delete from S3 first
        if (fileKeys.length > 0) {
            const command = new DeleteObjectsCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Delete: { Objects: fileKeys },
                
            });

          
            try {
                await s3Client.send(command);
                console.log('✅ S3 deletion successful.');
            } catch (s3Error) {
                console.error('❌ S3 deletion failed:', s3Error.message);
                // Stop here — don't delete from DB
                return res.status(500).json({
                    message: 'Failed to delete files from S3. Submission not removed from database.',
                    error: s3Error.message,
                });
            }
        }

        // 4️⃣ Delete from Mongo only if S3 succeeded
        await Submission.findByIdAndDelete(req.params.id);
        console.log('✅ Submission deleted from MongoDB.');


        try {
            await logActivity(
                user,
                'Deleted Submission',
                `Submission ID: ${req.params.id}, Department: ${submission.department}`,
                submission.academicYear,
                req.ip
            );
        } catch (logError) {
            console.warn(`⚠️ Activity log failed for submission ${req.params.id}:`, logError.message);
        }

        res.status(200).json({ message: 'Submission and all related files deleted successfully.' });
    } catch (error) {
        console.error('❌ Error deleting submission:', error);
        res.status(500).json({
            message: 'Failed to delete submission',
            error: error.message,
        });
    }
};

const getSubmissionStatus = async (req, res) => {

    try {
        const { academicYear } = req.query;


        if (!academicYear) {
            return res.status(400).json({
                message: "Provide Academic Year!!"
            });
        }

        const submissions = await Submission.find(
            { academicYear },
            { title: 1, status: 1, academicYear: 1, updatedAt: 1 }
        );




        res.status(200).json({
            message: "Submission status fetched successfully",
            data: submissions,
        });

    } catch (error) {
        console.error("❌ Error Getting Submission Status :", error);
        res.status(500).json({
            message: "Failed to Get Submission Status",
            error: error.message,
        });
    }
};



// Export all controller functions for use in the routes file.
module.exports = {
    createSubmission,
    updateSubmission,
    getMyDepartmentSubmissions,
    getSubmissionsForReview,
    getApprovedSubmissions,
    getSubmissionById,
    getSubmissionsForSuperuser,
    submitAppeal,
    deleteSubmission,
    getSubmissionStatus
};