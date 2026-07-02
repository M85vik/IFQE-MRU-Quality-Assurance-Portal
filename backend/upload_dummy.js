require('dotenv').config();
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('./config/s3Client');
const mongoose = require('mongoose');
const crypto = require('crypto');

const csvContent = `3.10.1 Alumni representatives in various committees
3.10.3 Number of lectures/seminars/events by alumni
S.No.,Alumni Name,Passing Year,Program and Branch,Committees name where alumni are involved,Alumni Contribution(Lecture/Seminar/Event),Title of the Event,Date,Mode(online/offline),Organizing Department,Evidence Link
1,John Doe,2020,B.Tech CS,,Lecture,Tech Talk 101,2025-01-01,Offline,CS Dept,link
2,Jane Smith,2019,B.Tech ME,,,Career Seminar,2025-02-01,Online,ME Dept,link
3,Bob Johnson,2021,B.Tech EE,,Event,Alumni Meetup,2025-03-01,Offline,EE Dept,link
4,Alice Williams,2018,MBA,,Lecture,Business 101,2025-04-01,Online,Mgmt Dept,link`;

const generateFileName = () => crypto.randomBytes(16).toString('hex');
const fileKey = `evidence/2026-2027/testSchool/testDept/3.10.3/main/${generateFileName()}.csv`;

async function run() {
  try {
    console.log('Connecting to Mongo...');
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Uploading to S3...');
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: Buffer.from(csvContent, 'utf-8'),
      ContentType: 'text/csv'
    });
    await s3Client.send(command);
    console.log('Uploaded fileKey:', fileKey);

    console.log('Updating Database...');
    const Submission = require('./models/Submission');
    const doc = await Submission.findById('69a05b69b09662693ade84a8');
    if (!doc) {
      throw new Error('Document 69a05b69b09662693ade84a8 not found');
    }

    let updated = false;
    doc.partB.criteria.forEach(c => {
      c.subCriteria.forEach(sc => {
        sc.indicators.forEach(i => {
          if (i.indicatorCode === '3.10.3') {
            i.fileKey = fileKey;
            updated = true;
          }
        });
      });
    });

    if (updated) {
      await doc.save();
      console.log('Done! Database updated.');
    } else {
      console.log('Indicator 3.10.3 not found in doc.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

run();
