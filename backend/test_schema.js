const mongoose = require('mongoose');
require('dotenv').config();
const Submission = require('./models/Submission');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

async function testEvidenceFileKeys() {
  try {
    const submissions = await Submission.find().sort({ updatedAt: -1 }).limit(1);
    if (!submissions.length) {
      console.log('No submissions found.');
      return;
    }

    const submission = submissions[0];
    console.log(`Testing submission: ${submission._id}`);
    
    // Find an indicator to modify
    let targetInd = null;
    submission.partB.criteria.forEach(c => {
      c.subCriteria.forEach(sc => {
        sc.indicators.forEach(ind => {
            if (!targetInd) targetInd = ind;
        });
      });
    });

    if (targetInd) {
        console.log(`Modifying indicator: ${targetInd.indicatorCode}`);
        targetInd.evidenceFileKeys = ['test-key-12345'];
        
        // Mark modified explicitly
        submission.markModified('partB');
        
        const result = await submission.save();
        console.log('Saved submission.');

        // Verify save
        const verifySub = await Submission.findById(submission._id);
        let found = false;
         verifySub.partB.criteria.forEach(c => {
            c.subCriteria.forEach(sc => {
                sc.indicators.forEach(ind => {
                    if (ind.indicatorCode === targetInd.indicatorCode) {
                        console.log(`Indicator ${ind.indicatorCode} evidenceFileKeys after save:`, ind.evidenceFileKeys);
                        if (ind.evidenceFileKeys && ind.evidenceFileKeys.includes('test-key-12345')) {
                            found = true;
                        }
                    }
                });
            });
        });

        if (found) {
            console.log('SUCCESS: evidenceFileKeys field works and persists.');
        } else {
            console.log('FAILURE: evidenceFileKeys did not persist.');
        }

    } else {
        console.log('No indicator found to modify.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testEvidenceFileKeys();