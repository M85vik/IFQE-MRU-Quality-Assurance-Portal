/**
 * @fileoverview This file defines the API routes for handling file operations via S3 pre-signed URLs.

 * @module routes/fileRoutes
 */

const express = require('express');
const router = express.Router();

// --- Controller and Middleware Imports ---

// Import controller functions that contain the logic for generating URLs and handling S3 commands.

const { getUploadUrl, getDownloadUrl, deleteFile, handleLocalUpload, handleLocalDownload } = require('../controllers/fileController'); 

// Import the 'protect' middleware to ensure a user is authenticated via JWT.
const { protect } = require('../middleware/authMiddleware');


// --- Route Definitions ---

// Local upload/download fallback endpoints
router.put('/local-upload', express.raw({ type: '*/*', limit: '100mb' }), handleLocalUpload);
router.get('/local-download', handleLocalDownload);

/**
 * @route   POST /api/files/upload-url
 * @desc    Generates a secure, temporary pre-signed URL for a client-side upload to S3.
 *          The controller performs authorization checks to ensure the user has permission.
 * @access  Private (Authenticated users)
 */
router.post('/upload-url', protect, getUploadUrl);

/**
 * @route   GET /api/files/download-url
 * @desc    Generates a secure, temporary pre-signed URL to download a file directly from S3.
 *          The controller verifies if the user is the owner or a reviewer before granting access.
 * @access  Private (Authenticated users)
 */
router.get('/download-url', protect, getDownloadUrl);

/**
 * @route   DELETE /api/files/delete-file
 * @desc    Deletes a file from S3 after performing authorization checks.
 *          The controller ensures the user owns the file and that the associated submission is in 'Draft' status.
 * @access  Private (Authenticated users)
 */
router.delete('/delete-file', protect, deleteFile);





// Export the configured router to be mounted in the main server file.
module.exports = router;