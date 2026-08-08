// config/db.js
const mongoose = require('mongoose');

const seedDefaultData = async () => {
  try {
    const User = require('../models/User');
    const School = require('../models/School');
    const Department = require('../models/Department');
    const Indicator = require('../models/Indicator');
    const indicatorsData = require('../data/indicators');

    const userCount = await User.countDocuments();
    if (userCount > 0) return;

    console.log('[DB] Seeding default initial data...');
    if (indicatorsData && Array.isArray(indicatorsData)) {
      await Indicator.deleteMany({});
      await Indicator.insertMany(indicatorsData);
    }

    const schoolEng = await School.create({ name: 'School of Engineering' });
    const csDept = await Department.create({ name: 'Computer Science & Technology', school: schoolEng._id });

    await User.create({
      name: 'Test Admin User',
      email: 'admin@test.com',
      password: '123456',
      role: 'admin',
    });

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
      name: 'Test Superuser',
      email: 'superuser@test.com',
      password: '123456',
      role: 'superuser',
    });

    await User.create({
      name: 'Test Developer',
      email: 'developer@test.com',
      password: '123456',
      role: 'developer',
    });

    console.log('[DB] Default test accounts seeded successfully (admin@test.com / 123456).');
  } catch (err) {
    console.error('[DB] Seeding error:', err.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`[DB] MongoDB Atlas Connected: ${conn.connection.host}`);
    await seedDefaultData();
  } catch (error) {
    console.warn(`[DB Warning] Primary MongoDB connection failed (${error.message}).`);
    try {
      console.log('[DB] Starting In-Memory MongoDB Server fallback...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[DB] In-Memory MongoDB Connected successfully: ${conn.connection.host}`);
      await seedDefaultData();
    } catch (memError) {
      console.error('[DB Error] Unable to connect to MongoDB or In-Memory fallback:', memError.message);
    }
  }
};

module.exports = connectDB;