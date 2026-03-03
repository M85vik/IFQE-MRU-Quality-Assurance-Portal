const mongoose = require('mongoose');
require('dotenv').config();
const Submission = require('./models/Submission');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

async function checkEvidenceFileKeys() {
  try {
    const submissions = await Submission.find().sort({ updatedAt: -1 }).limit(1);
    if (!submissions.length) {
      console.log('No submissions found.');
      return;
    }

    const submission = submissions[0];
    console.log(`Checking latest submission: ${submission._id}`);
    
    let foundKeys = [];
    submission.partB.criteria.forEach(c => {
      c.subCriteria.forEach(sc => {
        sc.indicators.forEach(ind => {
          if (ind.evidenceFileKeys && ind.evidenceFileKeys.length > 0) {
            console.log(`Indicator ${ind.indicatorCode} has keys:`, ind.evidenceFileKeys);
            foundKeys.push(...ind.evidenceFileKeys);
          }
        });
      });
    });

    if (foundKeys.length === 0) {
      console.log('No evidenceFileKeys found in any indicator.');
    } else {
      console.log(`Total evidenceFileKeys found: ${foundKeys.length}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkEvidenceFileKeys();