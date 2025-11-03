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
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/s3Client');


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
    const existingSubmission = await Submission.findOne({
        department: fullUser.department._id,
        academicYear,
        title,
    });
    if (existingSubmission) {
        return res.status(400).json({ message: `A submission with this title for ${academicYear} already exists.` });
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
const updateSubmission = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id).populate('school department');
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        const { role } = req.user;
        const { partA, partB, status, appeal } = req.body;

        // --- DEPARTMENT LOGIC ---
        // Departments can only edit 'Draft' submissions within the submission window.
        if (role === 'department') {
            const windowOpen = await isSubmissionWindowOpen(submission.academicYear);
            if (!windowOpen) {
                return res.status(403).json({ message: `The submission window for the academic year ${submission.academicYear} is closed. You cannot save changes.` });
            }
            if (submission.status !== 'Draft') {
                return res.status(403).json({ message: 'Cannot edit a submission that is under review or approved.' });
            }

            // Clean up old S3 files before updating with new ones.
            if (partA) {
                if (submission.partA.summaryFileKey && submission.partA.summaryFileKey !== partA.summaryFileKey) {
                    deleteS3Object(submission.partA.summaryFileKey);
                }
                submission.partA = partA;
            }

            if (partB && partB.criteria) {
                // This complex loop is necessary to find and delete old S3 files that are being replaced.
                partB.criteria.forEach(reqCriterion => {
                    const dbCriterion = submission.partB.criteria.find(c => c.criteriaCode === reqCriterion.criteriaCode);
                    if (dbCriterion) {
                        reqCriterion.subCriteria.forEach(reqSubCriterion => {
                            const dbSubCriterion = dbCriterion.subCriteria.find(sc => sc.subCriteriaCode === reqSubCriterion.subCriteriaCode);
                            if (dbSubCriterion) {
                                reqSubCriterion.indicators.forEach(reqIndicator => {
                                    const dbIndicator = dbSubCriterion.indicators.find(i => i.indicatorCode === reqIndicator.indicatorCode);
                                    if (dbIndicator) {
                                        if (dbIndicator.fileKey && dbIndicator.fileKey !== reqIndicator.fileKey) deleteS3Object(dbIndicator.fileKey);
                                        if (dbIndicator.evidenceLinkFileKey && dbIndicator.evidenceLinkFileKey !== reqIndicator.evidenceLinkFileKey) deleteS3Object(dbIndicator.evidenceLinkFileKey);
                                    }
                                });
                            }
                        });
                    }
                });
                submission.partB = partB;
                // IMPORTANT: Mongoose cannot automatically detect changes in deeply nested arrays.
                // We must explicitly tell Mongoose that the 'partB' path has been modified for it to save correctly.
                submission.markModified('partB');
            }

            // A department can move the status from 'Draft' to 'Under Review', finalizing their submission.
            if (status === 'Under Review') {
                submission.status = 'Under Review';
            }
        
        // --- QAA REVIEWER LOGIC ---
        // QAA can only add review scores/remarks to 'Under Review' submissions.
        } else if (role === 'qaa') {
            if (submission.status !== 'Under Review') {
                return res.status(403).json({ message: 'This submission is not currently under review.' });
            }
            if (partB && partB.criteria) {
                // Merge QAA's review data into the existing submission document.
                submission.partB.criteria.forEach(dbCriterion => {
                    const reqCriterion = partB.criteria.find(c => c.criteriaCode === dbCriterion.criteriaCode);
                    if (reqCriterion) {
                        dbCriterion.reviewScore = reqCriterion.reviewScore;
                        dbCriterion.subCriteria.forEach(dbSubCriterion => {
                            const reqSubCriterion = reqCriterion.subCriteria.find(sc => sc.subCriteriaCode === dbSubCriterion.subCriteriaCode);
                            if (reqSubCriterion) {
                                dbSubCriterion.remark = reqSubCriterion.remark;
                                dbSubCriterion.indicators.forEach(dbIndicator => {
                                    const reqIndicator = reqSubCriterion.indicators.find(i => i.indicatorCode === dbIndicator.indicatorCode);
                                    if (reqIndicator) {
                                        dbIndicator.reviewScore = reqIndicator.reviewScore;
                                        dbIndicator.reviewRemark = reqIndicator.reviewRemark;
                                    }
                                });
                            }
                        });
                    }
                });
                submission.markModified('partB');
            }
            // A QAA can move the status to 'Pending Final Approval' to send it to the superuser.
            if (status && status === 'Pending Final Approval') {
                submission.status = status;
            }
        
        // --- SUPERUSER LOGIC ---
        // Superuser handles final approval and appeal decisions.
        } else if (role === 'superuser') {
            if (!['Pending Final Approval', 'Appeal Submitted'].includes(submission.status)) {
                return res.status(403).json({ message: 'This submission is not ready for final approval or appeal review.' });
            }
            
            // Handle Appeal decisions
            if (submission.status === 'Appeal Submitted') {
                appeal.indicators.forEach(appealedIndicator => {
                    submission.partB.criteria.forEach(c => c.subCriteria.forEach(sc => {
                       const indicatorToUpdate = sc.indicators.find(i => i.indicatorCode === appealedIndicator.indicatorCode);
                       if (indicatorToUpdate) indicatorToUpdate.finalScore = appealedIndicator.finalScore; // Update the final score
                    }));
                    const dbAppealIndicator = submission.appeal.indicators.find(i => i.indicatorCode === appealedIndicator.indicatorCode);
                    if (dbAppealIndicator) dbAppealIndicator.superuserDecisionComment = appealedIndicator.superuserDecisionComment;
                });
                submission.status = 'Appeal Closed';
                submission.appeal.status = 'Closed';
                submission.appeal.closedOn = new Date();
                submission.archiveFileKey = await createSubmissionArchive(submission); // Generate final archive

            // Handle normal Final Approval
            } else { 
                // Merge superuser's final scores and remarks.
                partB.criteria.forEach(reqCriterion => {
                    const dbCriterion = submission.partB.criteria.find(c => c.criteriaCode === reqCriterion.criteriaCode);
                    if (dbCriterion) {
                        dbCriterion.finalScore = reqCriterion.finalScore;
                        reqCriterion.subCriteria.forEach(reqSubCriterion => {
                            const dbSubCriterion = dbCriterion.subCriteria.find(sc => sc.subCriteriaCode === reqSubCriterion.subCriteriaCode);
                            if (dbSubCriterion) {
                                dbSubCriterion.superuserRemark = reqSubCriterion.superuserRemark;
                                reqSubCriterion.indicators.forEach(reqIndicator => {
                                    const dbIndicator = dbSubCriterion.indicators.find(i => i.indicatorCode === reqIndicator.indicatorCode);
                                    if (dbIndicator) {
                                        dbIndicator.finalScore = reqIndicator.finalScore;
                                        dbIndicator.superuserRemark = reqIndicator.superuserRemark;
                                    }
                                });
                            }
                        });
                    }
                });
                submission.status = 'Completed';
                submission.archiveFileKey = await createSubmissionArchive(submission); // Generate final archive
            }
            submission.markModified('partB');
            submission.markModified('appeal'); // Also mark appeal as modified if changes were made.
        } 
        else {
            return res.status(403).json({ message: 'Not authorized for this action' });
        }

        const updatedSubmission = await submission.save();
        res.json(updatedSubmission);
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
        // Base filter for submissions that are ready for review.
        const filter = {
            status: 'Under Review',
            school: { $ne: null },
            department: { $ne: null }
        };

        // Add optional query parameters to the filter.
        if (academicYear) filter.academicYear = academicYear;
        if (school) filter.school = school;
        if (department) filter.department = department;

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
};