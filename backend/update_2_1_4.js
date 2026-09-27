const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Indicator = require('./models/Indicator');

dotenv.config();

const update = async () => {
  try {
    await connectDB();
    const result = await Indicator.findOneAndUpdate(
      { indicatorCode: "2.1.4" },
      { $set: { "guidelines.formula": " Citation value of school plus H-Index of the school, sourced through IRNS/ Total number of paper" } },
      { new: true }
    );
    console.log("Updated 2.1.4 formula:", result?.guidelines?.formula);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

update();
