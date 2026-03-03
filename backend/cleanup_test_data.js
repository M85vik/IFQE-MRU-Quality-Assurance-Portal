const mongoose = require('mongoose');
require('dotenv').config();
const Submission = require('./models/Submission');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

async function cleanupTestData() {
  try {
    const submissions = await Submission.find();
    let modifiedCount = 0;

    for (const submission of submissions) {
      let isModified = false;
      submission.partB.criteria.forEach(c => {
        c.subCriteria.forEach(sc => {
          sc.indicators.forEach(ind => {
            if (ind.evidenceFileKeys && ind.evidenceFileKeys.includes('test-key-12345')) {
              console.log(`Found and removing 'test-key-12345' from indicator ${ind.indicatorCode} in submission ${submission._id}`);
              ind.evidenceFileKeys = ind.evidenceFileKeys.filter(key => key !== 'test-key-12345');
              isModified = true;
            }
          });
        });
      });

      // Also clean up main file keys if they matched somehow (unlikely but safe)
      // ...

      if (isModified) {
        submission.markModified('partB');
        await submission.save();
        modifiedCount++;
      }
    }

    console.log(`Cleanup complete. Modified ${modifiedCount} submissions.`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

cleanupTestData();