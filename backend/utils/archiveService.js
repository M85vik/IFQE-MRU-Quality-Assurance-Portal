// const { GetObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
// const { Upload } = require("@aws-sdk/lib-storage");
// const s3Client = require('../config/s3Client');
// const archiver = require('archiver');
// const { PassThrough, Readable } = require('stream');
// const ArchiveLog = require('../models/ArchiveLog');

// // --- HELPER FUNCTIONS (No changes) ---

// function toNodeStream(body) {
//     if (body instanceof Readable) return body;
//     if (body && typeof body[Symbol.asyncIterator] === 'function') return Readable.from(body);
//     throw new Error('Unexpected Body type from S3.');
// }

// const streamToBuffer = (stream) => new Promise((resolve, reject) => {
//     const chunks = [];
//     stream.on('data', (chunk) => chunks.push(chunk));
//     stream.on('error', reject);
//     stream.on('end', () => resolve(Buffer.concat(chunks)));
// });


// // --- MAIN SERVICE FUNCTION ---

// const createSubmissionArchive = async (submission) => {
//     const SUB_ID = submission._id;
//     console.log(`[Archive Service | ${SUB_ID}] --- STARTING ARCHIVE ---`);
//     let start = new Date();
//     // --- 1. Collect file keys ---
//     const fileKeys = [];
//     // ... (your file collection logic)
//     if (submission.partA.summaryFileKey) {
//         const fileName = submission.partA.summaryFileKey.split('/').pop();
//         fileKeys.push({ key: submission.partA.summaryFileKey, name: `Part A - Executive Summary - ${fileName}` });
//     }
//     submission.partB.criteria.forEach(c => {
//         c.subCriteria.forEach(sc => {
//             sc.indicators.forEach(i => {
//                 if (i.fileKey) {
//                     const fileName = i.fileKey.split('/').pop();
//                     fileKeys.push({ key: i.fileKey, name: `Part B/Criterion ${c.criteriaCode}/${sc.subCriteriaCode}/${i.indicatorCode} - ${fileName}` });
//                 }
//                 if (i.evidenceLinkFileKey) {
//                     const fileName = i.evidenceLinkFileKey.split('/').pop();
//                     fileKeys.push({ key: i.evidenceLinkFileKey, name: `Part B/Criterion ${c.criteriaCode}/${sc.subCriteriaCode}/${i.indicatorCode} - Evidence - ${fileName}` });
//                 }
//             });
//         });
//     });

//     if (fileKeys.length === 0) {
//         console.log(`[Archive Service | ${SUB_ID}] No files found. Exiting.`);
//         return null;
//     }
//     console.log(`[Archive Service | ${SUB_ID}] Found ${fileKeys.length} files.`);

//     // --- 2. Setup streams and S3 upload params ---
//     const passThrough = new PassThrough();
//     const archive = archiver('zip', { zlib: { level: 9 } });

//     const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
//     if (!S3_BUCKET_NAME) throw new Error("S3_BUCKET_NAME env var not set.");
//     const archiveKey = `archives/${submission.academicYear}/${submission.school.name.replace(/ /g, '_')}/${submission.department.name.replace(/ /g, '_')}/${submission.title.replace(/ /g, '_')}.zip`;

//     const upload = new Upload({
//         client: s3Client,
//         params: { Bucket: S3_BUCKET_NAME, Key: archiveKey, Body: passThrough, ContentType: 'application/zip' },
//     });

//     // --- 3. Create two promises that run in parallel ---
//     // Promise 1: The S3 upload. It consumes the passThrough stream.
//     const uploadPromise = upload.done();
//     console.log(`[Archive Service | ${SUB_ID}] S3 Upload initiated. Waiting for data.`);

//     // Promise 2: The archive creation. It produces data and writes to the passThrough stream.
//     // We wrap this in an immediately-invoked async function to handle its lifecycle.
//     const archivePromise = (async () => {
//         // IMPORTANT: Pipe archiver to passThrough. If the archiver has an error, destroy the passThrough.
//         archive.on('error', (err) => passThrough.destroy(err));
//         archive.pipe(passThrough);

//         for (let i = 0; i < fileKeys.length; i++) {
//             const file = fileKeys[i];
//             try {
//                 const getObjectCommand = new GetObjectCommand({ Bucket: S3_BUCKET_NAME, Key: file.key });
//                 const response = await s3Client.send(getObjectCommand);
//                 const fileBuffer = await streamToBuffer(toNodeStream(response.Body));
//                 archive.append(fileBuffer, { name: file.name });
//                 console.log(`[Archive Service | ${SUB_ID}] Appended file ${i + 1}/${fileKeys.length}: ${file.name}`);
//             } catch (err) {
//                 console.error(`[Archive Service | ${SUB_ID}] Skipping file ${file.key} due to error:`, err.name);
//                 archive.append(`File not found: ${file.key}`, { name: `MISSING_FILE - ${file.name.replace(/\//g, '_')}.txt` });
//             }
//         }

//         console.log(`[Archive Service | ${SUB_ID}] All files appended. Finalizing archive...`);
//         // This might take time if the upload is slow (due to backpressure), but it will resolve.
//         await archive.finalize();
//         console.log(`[Archive Service | ${SUB_ID}] Archive finalized.`);
//     })();

//     try {
//         // --- 4. Wait for BOTH promises to complete ---
//         // This is the key. `Promise.all` ensures we wait for both the producer and consumer to finish.
//         // If `archivePromise` fails, it will reject here. If `uploadPromise` fails, it will reject here.
//         await Promise.all([archivePromise, uploadPromise]);

//         console.log(`[Archive Service | ${SUB_ID}] Upload successful.`);


//         // --- 5. Update database ---
//         submission.archiveFileKey = archiveKey;
//         await submission.save();
//         console.log(`[Archive Service | ${SUB_ID}] DB updated successfully.`);

//         console.log(`[Archive Service | ${SUB_ID}] --- ARCHIVE PROCESS SUCCESSFUL ---`);
//         let end = new Date();
//         let duration = (end - start) / 1000
//         console.log(`Time Taken : ${duration}s.`);

//         // --- SAFE ZIP SIZE CHECK (Does NOT break the main process) ---
//         let zipSizeMB = 0;
//         try {
//             const headResult = await s3Client.send(
//                 new HeadObjectCommand({
//                     Bucket: S3_BUCKET_NAME,
//                     Key: archiveKey,
//                 })
//             );

//             zipSizeMB = Number((headResult.ContentLength / (1024 * 1024)).toFixed(2));
//             console.log(`[Archive Service | ${SUB_ID}] Final ZIP Size: ${zipSizeMB} MB`);

//         } catch (sizeErr) {
//             console.warn(`[Archive Service | ${SUB_ID}] Failed to fetch ZIP size:`, sizeErr.message);
//         }




//         // --- SAVE LOG SAFELY ---
//         try {
//             await ArchiveLog.create({
//                 submissionId: submission._id,
//                 submissionTitle: submission.title,
//                 school: submission.school?.name,
//                 department: submission.department?.name,
//                 fileCount: fileKeys.length,
//                 timeTakenSec: duration,
//                 archiveKey: archiveKey,
//                  zipSizeMB,
//                 createdBy: submission.updatedByRole || 'superuser'
//             });
//             console.log(`[Archive Service | ${SUB_ID}] ArchiveLog saved.`);
//         } catch (logErr) {
//             console.warn(`[Archive Service | ${SUB_ID}] FAILED to save ArchiveLog:`, logErr.message);
//         }





//         return archiveKey;
//     } catch (error) {
//         console.error(`[Archive Service | ${SUB_ID}] --- CRITICAL FAILURE IN ARCHIVE PROCESS ---`, error);
//         // If something failed, we should try to abort the upload if it's still in progress.
//         upload.abort();
//         throw error;
//     }
// };

// module.exports = { createSubmissionArchive };


/**
 * Memory-Efficient Archive Service
 * S3 → Local SSD Disk → Stream ZIP → S3
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { PassThrough, Readable } = require('stream');
const { pipeline } = require('stream/promises');

const { GetObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

const s3Client = require('../config/s3Client');
const ArchiveLog = require('../models/ArchiveLog');

// ------------------------------------------------------------------
// CONFIG (SSD-BACKED TEMP STORAGE)
// ------------------------------------------------------------------

const BASE_TEMP_DIR =
  process.env.ARCHIVE_TEMP_DIR || '/var/tmp/archives';

// ------------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------------

function toNodeStream(body) {
  if (body instanceof Readable) return body;
  if (body && typeof body[Symbol.asyncIterator] === 'function') {
    return Readable.from(body);
  }
  throw new Error('Unexpected S3 Body type');
}

const sanitize = (name) =>
  name.replace(/[\/\\?%*:|"<>]/g, '_').trim();

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function downloadS3ToDisk(bucket, key, destination) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const { Body } = await s3Client.send(command);

  await pipeline(
    toNodeStream(Body),
    fs.createWriteStream(destination)
  );
}

// ------------------------------------------------------------------
// MAIN SERVICE
// ------------------------------------------------------------------

const createSubmissionArchive = async (submission) => {
  const SUB_ID = submission._id.toString();
  const startTime = Date.now();

  const BUCKET = process.env.S3_BUCKET_NAME;
  if (!BUCKET) throw new Error('S3_BUCKET_NAME not set');

  const jobDir = path.join(BASE_TEMP_DIR, `submission_${SUB_ID}`);

  let upload;
  let archiveKey;

  try {
    console.log(`[Archive | ${SUB_ID}] START`);

    // --------------------------------------------------------------
    // 1. Ensure base + job directories
    // --------------------------------------------------------------

    await ensureDir(BASE_TEMP_DIR);
    await ensureDir(jobDir);

    // --------------------------------------------------------------
    // 2. Collect file metadata
    // --------------------------------------------------------------

    const files = [];

    if (submission.partA?.summaryFileKey) {
      const fileName = submission.partA.summaryFileKey.split('/').pop();
      files.push({
        key: submission.partA.summaryFileKey,
        zipName: `Part A - Executive Summary - ${fileName}`,
      });
    }

    submission.partB.criteria.forEach(c => {
      c.subCriteria.forEach(sc => {
        sc.indicators.forEach(i => {
          if (i.fileKey) {
            files.push({
              key: i.fileKey,
              zipName: `Part B Criterion ${c.criteriaCode} ${sc.subCriteriaCode} ${i.indicatorCode} - ${i.fileKey.split('/').pop()}`
            });
          }
          if (i.evidenceLinkFileKey) {
            files.push({
              key: i.evidenceLinkFileKey,
              zipName: `Part B Criterion ${c.criteriaCode} ${sc.subCriteriaCode} ${i.indicatorCode} Evidence - ${i.evidenceLinkFileKey.split('/').pop()}`
            });
          }
        });
      });
    });

    if (!files.length) {
      console.log(`[Archive | ${SUB_ID}] No files found`);
      return null;
    }

    console.log(`[Archive | ${SUB_ID}] Downloading ${files.length} files`);

    // --------------------------------------------------------------
    // 3. Download files to SSD (STREAMED)
    // --------------------------------------------------------------

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const localPath = path.join(jobDir, sanitize(f.zipName));

      try {
        await downloadS3ToDisk(BUCKET, f.key, localPath);
        f.localPath = localPath;
        console.log(`[Archive | ${SUB_ID}] Downloaded ${i + 1}/${files.length}`);
      } catch (err) {
        console.warn(`[Archive | ${SUB_ID}] Missing file: ${f.key}`);
        const missingPath = path.join(jobDir, `MISSING_${i}.txt`);
        await fs.promises.writeFile(missingPath, `Missing file: ${f.key}`);
        f.localPath = missingPath;
        f.zipName = `MISSING_FILE_${i}.txt`;
      }
    }

    // --------------------------------------------------------------
    // 4. ZIP → S3 STREAMING
    // --------------------------------------------------------------

    const passThrough = new PassThrough();
    const archive = archiver('zip', { zlib: { level: 9 } });

    archiveKey = `archives/${submission.academicYear}/${sanitize(
      submission.school.name
    )}/${sanitize(submission.department.name)}/${sanitize(
      submission.title
    )}.zip`;

    upload = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET,
        Key: archiveKey,
        Body: passThrough,
        ContentType: 'application/zip',
      },
    });

    archive.on('error', err => passThrough.destroy(err));
    archive.pipe(passThrough);

    for (const f of files) {
      archive.append(
        fs.createReadStream(f.localPath),
        { name: sanitize(f.zipName) }
      );
    }

    console.log(`[Archive | ${SUB_ID}] Upload started`);

    const uploadPromise = upload.done();
    await archive.finalize();
    await uploadPromise;

    console.log(`[Archive | ${SUB_ID}] Upload completed`);

    // --------------------------------------------------------------
    // 5. Save DB
    // --------------------------------------------------------------

    submission.archiveFileKey = archiveKey;
    await submission.save();

    // --------------------------------------------------------------
    // 6. ZIP size (safe)
    // --------------------------------------------------------------

    let zipSizeMB = 0;
    try {
      const head = await s3Client.send(
        new HeadObjectCommand({
          Bucket: BUCKET,
          Key: archiveKey,
        })
      );
      zipSizeMB = Number((head.ContentLength / (1024 * 1024)).toFixed(2));
    } catch (_) {}

    // --------------------------------------------------------------
    // 7. Save log (non-blocking)
    // --------------------------------------------------------------

    try {
      await ArchiveLog.create({
        submissionId: submission._id,
        submissionTitle: submission.title,
        school: submission.school?.name,
        department: submission.department?.name,
        fileCount: files.length,
        timeTakenSec: (Date.now() - startTime) / 1000,
        archiveKey,
        zipSizeMB,
        createdBy: submission.updatedByRole || 'superuser',
      });
    } catch (logErr) {
      console.warn(`[Archive | ${SUB_ID}] Log save failed`, logErr.message);
    }

    console.log(`[Archive | ${SUB_ID}] SUCCESS`);
    return archiveKey;

  } catch (err) {
    console.error(`[Archive | ${SUB_ID}] FAILED`, err);
    upload?.abort();
    throw err;

  } finally {
    // --------------------------------------------------------------
    // 8. GUARANTEED CLEANUP (CRITICAL)
    // --------------------------------------------------------------
    try {
      await fs.promises.rm(jobDir, {
        recursive: true,
        force: true,
      });
      console.log(`[Archive | ${SUB_ID}] Temp cleaned`);
    } catch (cleanupErr) {
      console.warn(
        `[Archive | ${SUB_ID}] Cleanup failed`,
        cleanupErr.message
      );
    }
  }
};

module.exports = { createSubmissionArchive };
