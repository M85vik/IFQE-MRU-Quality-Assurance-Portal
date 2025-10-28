const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

const Indicator = require('../models/Indicator');
const School = require('../models/School');
const Department = require('../models/Department');
const User = require('../models/User');
const Submission = require('../models/Submission');

const indicators = require('../data/indicators');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Indicator.deleteMany();
    await School.deleteMany();
    await Department.deleteMany();
    await User.deleteMany();
    await Submission.deleteMany();

    await Indicator.insertMany(indicators);
    console.log('Indicators Imported...');

    // Create the full list of 5 schools and 8 departments
    const schoolEng = await School.create({ name: 'School of Engineering' });
    const schoolLaw = await School.create({ name: 'School of Law' });
    const schoolManagement = await School.create({ name: 'School of Management & Commerce' });
    const schoolEducation = await School.create({ name: 'School of Education & Humanities' });
    const schoolSciences = await School.create({ name: 'School of Sciences' });
    console.log('All 5 Schools Imported...');
    
    // Departments for School of Engineering
    const csDept = await Department.create({ name: 'Computer Science', school: schoolEng._id });
    await Department.create({ name: 'Mechanical Engineering', school: schoolEng._id });

    // Departments for School of Law
    await Department.create({ name: 'Corporate Law', school: schoolLaw._id });

    // Departments for School of Management & Commerce
    await Department.create({ name: 'Business Administration', school: schoolManagement._id });
    await Department.create({ name: 'Commerce', school: schoolManagement._id });
    
    // Departments for School of Education & Humanities
    await Department.create({ name: 'Education', school: schoolEducation._id });
    await Department.create({ name: 'English', school: schoolEducation._id });

    // Department for School of Sciences
    await Department.create({ name: 'Physics', school: schoolSciences._id });
    console.log('All 8 Departments Imported...');

    await User.create({
        name: 'Test Department User',
        email: 'department@test.com',
        password: '123456',
        role: 'department',
        school: schoolEng._id,
        department: csDept._id,
    });

    await User.create({
        name: 'Test QAA User',
        email: 'qaa@test.com',
        password: '123456',
        role: 'qaa',
    });

    await User.create({
        name: 'Test Admin User',
        email: 'admin@test.com',
        password: '123456',
        role: 'admin',
    });
    
    await User.create({
        name: 'Test Superuser',
        email: 'superuser@test.com',
        password: '123456',
        role: 'superuser',
    });
    
    console.log('Default Users Created...');

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Indicator.deleteMany();
    await School.deleteMany();
    await Department.deleteMany();
    await User.deleteMany();
    await Submission.deleteMany();
    
    console.log('Data Destroyed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}