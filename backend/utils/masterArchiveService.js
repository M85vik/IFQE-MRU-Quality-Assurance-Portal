/**
 * Master Archive Service
 * Groups files by indicator code across all approved departments for a given year.
 *
 * ZIP Structure:
 *   Part A - Executive Summary/
 *     DeptName - filename.pdf
 *   Criterion X/
 *     X.Y/
 *       X.Y.Z/
 *         DeptName - Data_Template.xlsx
 *         DeptName - Evidence 1 - file.pdf
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { PassThrough, Readable } = require('stream');
const { pipeline } = require('stream/promises');

const { GetObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

const s3Client = require('../config/s3Client');
const Submission = require('../models/Submission');
const ArchiveLog = require('../models/ArchiveLog');

// ------------------------------------------------------------------
// CONFIG
// ------------------------------------------------------------------

const BASE_TEMP_DIR = process.env.ARCHIVE_TEMP_DIR || path.join(__dirname, '../tmp/master-archives');

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
  await pipeline(toNodeStream(Body), fs.createWriteStream(destination));
}

// ------------------------------------------------------------------
// MAIN SERVICE
// ------------------------------------------------------------------

const createMasterArchive = async (academicYear, generatedBy) => {
  const startTime = Date.now();
  const BUCKET = process.env.S3_BUCKET_NAME;
  if (!BUCKET) throw new Error('S3_BUCKET_NAME not set');

  const jobDir = path.join(BASE_TEMP_DIR, `master_${academicYear.replace(/\//g, '-')}_${Date.now()}`);

  let upload;
  let archiveKey;

  try {
    console.log(`[MasterArchive | ${academicYear}] START`);

    // --------------------------------------------------------------
    // 1. Ensure directories
    // --------------------------------------------------------------
    await ensureDir(BASE_TEMP_DIR);
    await ensureDir(jobDir);

    // --------------------------------------------------------------
    // 2. Fetch all approved submissions for this year
    // --------------------------------------------------------------
    const submissions = await Submission.find({
      academicYear,
      status: { $in: ['Completed', 'Appeal Closed'] },
    }).populate('school department');

    if (!submissions.length) {
      console.log(`[MasterArchive | ${academicYear}] No approved submissions found`);
      return { archiveKey: null, submissionCount: 0, fileCount: 0, zipSizeMB: 0 };
    }

    console.log(`[MasterArchive | ${academicYear}] Found ${submissions.length} approved submissions`);

    // --------------------------------------------------------------
    // 3. Collect files grouped by indicator path
    // --------------------------------------------------------------
    const files = [];

    for (const sub of submissions) {
      const deptName = sanitize(sub.department?.name || 'Unknown_Dept');

      // Part A — Executive Summary
      if (sub.partA?.summaryFileKey) {
        const origName = sub.partA.summaryFileKey.split('/').pop();
        files.push({
          key: sub.partA.summaryFileKey,
          zipPath: `Part A - Executive Summary/${deptName} - ${origName}`,
        });
      }

      // Part B — Criteria → SubCriteria → Indicators
      if (sub.partB?.criteria) {
        sub.partB.criteria.forEach(criterion => {
          const criterionFolder = `Criterion ${criterion.criteriaCode.split('.')[0]}`;

          criterion.subCriteria.forEach(sc => {
            sc.indicators.forEach(indicator => {
              const indicatorFolder = `${criterionFolder}/${sc.subCriteriaCode}/${indicator.indicatorCode}`;

              // Data template file
              if (indicator.fileKey) {
                const origName = indicator.fileKey.split('/').pop();
                files.push({
                  key: indicator.fileKey,
                  zipPath: `${indicatorFolder}/${deptName} - Data_Template - ${origName}`,
                });
              }

              // Legacy single evidence file
              if (indicator.evidenceLinkFileKey) {
                const origName = indicator.evidenceLinkFileKey.split('/').pop();
                files.push({
                  key: indicator.evidenceLinkFileKey,
                  zipPath: `${indicatorFolder}/${deptName} - Evidence - ${origName}`,
                });
              }

              // Multiple evidence documents
              if (Array.isArray(indicator.evidenceFileKeys)) {
                indicator.evidenceFileKeys.forEach((efKey, idx) => {
                  const origName = efKey.split('/').pop();
                  files.push({
                    key: efKey,
                    zipPath: `${indicatorFolder}/${deptName} - Evidence ${idx + 1} - ${origName}`,
                  });
                });
              }
            });
          });
        });
      }
    }

    if (!files.length) {
      console.log(`[MasterArchive | ${academicYear}] No files found across submissions`);
      return { archiveKey: null, submissionCount: submissions.length, fileCount: 0, zipSizeMB: 0 };
    }

    console.log(`[MasterArchive | ${academicYear}] Downloading ${files.length} files to temp`);

    // --------------------------------------------------------------
    // 4. Download files to disk
    // --------------------------------------------------------------
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const localPath = path.join(jobDir, sanitize(f.zipPath.replace(/\//g, '_')));

      try {
        await downloadS3ToDisk(BUCKET, f.key, localPath);
        f.localPath = localPath;
        if ((i + 1) % 10 === 0 || i === files.length - 1) {
          console.log(`[MasterArchive | ${academicYear}] Downloaded ${i + 1}/${files.length}`);
        }
      } catch (err) {
        console.warn(`[MasterArchive | ${academicYear}] Missing file: ${f.key}`);
        const missingPath = path.join(jobDir, `MISSING_${i}.txt`);
        await fs.promises.writeFile(missingPath, `Missing file: ${f.key}`);
        f.localPath = missingPath;
        f.zipPath = f.zipPath.replace(/[^/]+$/, `MISSING_FILE_${i}.txt`);
      }
    }

    // --------------------------------------------------------------
    // 5. ZIP → S3 streaming
    // --------------------------------------------------------------
    const passThrough = new PassThrough();
    const archive = archiver('zip', { zlib: { level: 6 } }); // level 6 for speed vs compression balance

    archiveKey = `archives/master/${sanitize(academicYear)}/Master_Archive.zip`;

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
        { name: sanitize(f.zipPath) }
      );
    }

    console.log(`[MasterArchive | ${academicYear}] Upload started`);

    const uploadPromise = upload.done();
    await archive.finalize();
    await uploadPromise;

    console.log(`[MasterArchive | ${academicYear}] Upload completed`);

    // --------------------------------------------------------------
    // 6. ZIP size (safe)
    // --------------------------------------------------------------
    let zipSizeMB = 0;
    try {
      const head = await s3Client.send(
        new HeadObjectCommand({ Bucket: BUCKET, Key: archiveKey })
      );
      zipSizeMB = Number((head.ContentLength / (1024 * 1024)).toFixed(2));
    } catch (_) {}

    // --------------------------------------------------------------
    // 7. Save log (non-blocking)
    // --------------------------------------------------------------
    try {
      await ArchiveLog.create({
        submissionId: null,
        submissionTitle: `Master Archive ${academicYear}`,
        school: 'All Schools',
        department: 'All Departments',
        fileCount: files.length,
        timeTakenSec: (Date.now() - startTime) / 1000,
        archiveKey,
        zipSizeMB,
        createdBy: generatedBy || 'admin',
      });
    } catch (logErr) {
      console.warn(`[MasterArchive | ${academicYear}] Log save failed`, logErr.message);
    }

    console.log(`[MasterArchive | ${academicYear}] SUCCESS — ${files.length} files, ${zipSizeMB} MB`);

    return {
      archiveKey,
      submissionCount: submissions.length,
      fileCount: files.length,
      zipSizeMB,
    };

  } catch (err) {
    console.error(`[MasterArchive | ${academicYear}] FAILED`, err);
    upload?.abort();
    throw err;

  } finally {
    // --------------------------------------------------------------
    // 8. GUARANTEED CLEANUP
    // --------------------------------------------------------------
    try {
      await fs.promises.rm(jobDir, { recursive: true, force: true });
      console.log(`[MasterArchive | ${academicYear}] Temp cleaned`);
    } catch (cleanupErr) {
      console.warn(`[MasterArchive | ${academicYear}] Cleanup failed`, cleanupErr.message);
    }
  }
};

module.exports = { createMasterArchive };
