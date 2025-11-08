/**
 * @fileoverview This utility provides a service to create a ZIP archive of all files
 * associated with a submission. It operates entirely in memory using Node.js streams,
 * making it highly efficient. The process is as follows:
 * 1. Collect all S3 file keys from a given submission document.
 * 2. Create a writable stream (`PassThrough`) that will receive the ZIP data.
 * 3. Concurrently, initiate an upload of this stream to a new S3 object (the final ZIP file).
 * 4. Sequentially download each individual file from S3 as a readable stream.
 * 5. Pipe each downloaded file stream into an 'archiver' instance.
 * 6. The archiver compresses the data and writes it to the `PassThrough` stream.
 * 7. The S3 upload library consumes the data from the `PassThrough` stream as it arrives.
 * This avoids saving any files (source or destination) to the server's disk.
 * @module utils/archiveService
 */

// --- AWS SDK v3 Imports ---
const { GetObjectCommand } = require('@aws-sdk/client-s3');
// A high-level abstraction for multipart uploads, which is ideal for streaming large files.
const { Upload } = require("@aws-sdk/lib-storage");

// --- Local & Node.js Imports ---
const s3Client = require('../config/s3Client'); // The configured S3 client.
const archiver = require('archiver'); // A library for creating archives (ZIP, TAR, etc.).
const { PassThrough } = require('stream'); // A fundamental Node.js stream utility.


/**
 * Creates a ZIP archive in S3 containing all evidence files from a submission.
 * @param {object} submission - The fully populated Mongoose submission document.
 * @returns {Promise<string|null>} - The S3 key of the newly created archive, or null if there were no files.
 * @throws {Error} - Throws an error if the archiving process fails.
 */
const createSubmissionArchive = async (submission) => {
    console.log(`[Archive Service] Starting archive for submission: ${submission._id}`);
    try {
        // --- 1. Collect all file keys and desired filenames from the submission document ---
        const fileKeys = [];
        if (submission.partA.summaryFileKey) {
            const fileName = submission.partA.summaryFileKey.split('/').pop();
            fileKeys.push({ key: submission.partA.summaryFileKey, name: `Part A - Executive Summary - ${fileName}` });
        }
        submission.partB.criteria.forEach(c => {
            c.subCriteria.forEach(sc => {
                sc.indicators.forEach(i => {
                    if (i.fileKey) {
                        const fileName = i.fileKey.split('/').pop();
                        // Create a structured path inside the ZIP file for better organization.
                        fileKeys.push({ key: i.fileKey, name: `Part B/Criterion ${c.criteriaCode}/${sc.subCriteriaCode}/${i.indicatorCode} - ${fileName}` });
                    }
                    if (i.evidenceLinkFileKey) {
                        const fileName = i.evidenceLinkFileKey.split('/').pop();
                        fileKeys.push({ key: i.evidenceLinkFileKey, name: `Part B/Criterion ${c.criteriaCode}/${sc.subCriteriaCode}/${i.indicatorCode} - Evidence - ${fileName}` });
                    }
                });
            });
        });

        // If there are no files to archive, there's nothing to do.
        if (fileKeys.length === 0) {
            console.log(`[Archive Service] No files to archive for submission: ${submission._id}`);
            return null;
        }

        // --- 2. Set up the streaming pipeline ---
        const archive = archiver('zip', { zlib: { level: 9 } }); // High compression level.
        
        // A PassThrough stream is a simple readable/writable stream. Data written to it
        // is immediately made available to be read from it. It acts as a pipe or a buffer
        // connecting the archiver's output to the S3 uploader's input.
        const passThrough = new PassThrough();
        
        // Connect the output of the archiver to the input of our pass-through pipe.
        archive.pipe(passThrough);

        // Define the S3 key (full path and filename) for the final ZIP archive.
        // Replace spaces with underscores for URL-friendly names.
        const archiveKey = `archives/${submission.academicYear}/${submission.school.name.replace(/ /g, '_')}/${submission.department.name.replace(/ /g, '_')}/${submission.title.replace(/ /g, '_')}.zip`;

        // --- 3. Start the S3 Upload in parallel ---
        // The `Upload` utility will start listening to the `passThrough` stream for data.
        // It will not complete until the stream ends (when we call `archive.finalize()`).
        const S3_BUCKET_NAME=process.env.S3_BUCKET_NAME;
        if(!S3_BUCKET_NAME) throw new Error("Error Loading AWS Environment Variable.")
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: S3_BUCKET_NAME,
                Key: archiveKey,
                Body: passThrough, // The body of the upload is our stream.
                ContentType: 'application/zip',
            },
        });

        // --- 4. Fetch and append each file to the archive ---
        // This loop fetches each file from S3 one by one and appends it to the archive stream.
        for (const file of fileKeys) {
            try {
                const getObjectCommand = new GetObjectCommand({ Bucket:S3_BUCKET_NAME, Key: file.key });
                const response = await s3Client.send(getObjectCommand); // response.Body is a readable stream.
                console.log(`[Archive Service] Fetching from bucket: ${S3_BUCKET_NAME}, key: ${file.key}`);

                
                // Append the downloaded file stream to the archive with its new name.
                archive.append(response.Body, { name: file.name });
            } catch (getObjectError) {
                // Robustness: If a single file is missing from S3, don't fail the whole archive.
                // Instead, log the error and add a placeholder text file to the ZIP.
                console.error(`[Archive Service] Could not find or append file ${file.key}. Skipping.`);
                archive.append(`File not found in S3: ${file.name}`, { name: `MISSING_FILE_${file.name.replace(/\//g, '_')}.txt` });
            }
        }

        // --- 5. Finalize the process ---
        // Finalizing the archive tells it that no more files will be added. It writes
        // the central directory and then emits an 'end' signal on the `passThrough` stream.
        await archive.finalize();
        
        // `upload.done()` returns a promise that resolves when the S3 upload is fully complete.
        // This promise won't resolve until the `passThrough` stream has ended.
        await upload.done();



        //incomplete archiveFileKey fix
         submission.archiveFileKey=archiveKey;
         await submission.save();
        console.log("Submission archive filekey:", submission.archiveFileKey);
        

        
        
        console.log(`[Archive Service] Successfully created archive: ${archiveKey}`);
        return archiveKey; // Return the key of the new archive file.

    } catch (error) {
        console.error(`[Archive Service] Failed to create archive for submission ${submission._id}:`, error);
        throw error; // Re-throw the error so the calling function knows the process failed.
    }
};

module.exports = { createSubmissionArchive };