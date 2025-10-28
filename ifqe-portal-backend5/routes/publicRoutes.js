// ifqe-portal-backend5/routes/publicRoutes.js

const express = require('express');
const router = express.Router();
const School = require('../models/School');
const Department = require('../models/Department');
const { getActiveAnnouncements } = require('../controllers/announcementController'); // Import the new controller function

// @desc    Get all schools
// @route   GET /api/public/schools
// @access  Public
router.get('/schools', async (req, res) => {
    try {
        const schools = await School.find({}).sort('name');
        res.json(schools);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all departments for a selected school
// @route   GET /api/public/departments/:schoolId
// @access  Public
router.get('/departments/:schoolId', async (req, res) => {
    try {
        const departments = await Department.find({ school: req.params.schoolId }).sort('name');
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get active announcements for the homepage
// @route   GET /api/public/announcements
// @access  Public
router.get('/announcements', getActiveAnnouncements);

module.exports = router;