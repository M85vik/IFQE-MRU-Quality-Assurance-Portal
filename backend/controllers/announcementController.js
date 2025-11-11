// ifqe-portal-backend5/controllers/announcementController.js

const Announcement = require('../models/Announcement');
const logActivity = require("../utils/logActivity")
// @desc    Get all announcements (for admin)
// @route   GET /api/announcements
// @access  Private/Admin
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({}).sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get active announcements (for public homepage)
// @route   GET /api/public/announcements
// @access  Public
const getActiveAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({ isActive: true }).sort({ createdAt: -1 }).limit(3);
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create an announcement
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = async (req, res) => {
    const { category, title, summary, details, date, color } = req.body;
    const user = req.user;
    try {
        const announcement = new Announcement({
            category,
            title,
            summary,
            details,
            date,
            color,
        });

        const createdAnnouncement = await announcement.save();
        const now = new Date();
        const year = now.getFullYear(); // e.g., 2025
        const academicYear = `${year}-${(year + 1).toString().slice(-2)}`; // e.g., "2025-26"

        try {
            await logActivity(
                user,
                'Create Announcement',
                `Announcement ID: ${announcement._id}, Department: NA`,
                   `created ${academicYear}`,
                req.ip
            );
        } catch (logError) {
            console.warn(`⚠️ Activity log failed for Announcement ${req.params.id}:`, logError.message);
        }

        res.status(201).json(createdAnnouncement);
    } catch (error) {
        res.status(400).json({ message: 'Error creating announcement', error: error.message });
    }
};

// @desc    Update an announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
const updateAnnouncement = async (req, res) => {
    const { category, title, summary, details, date, color, isActive } = req.body;
    const user= req.user;
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (announcement) {
            announcement.category = category || announcement.category;
            announcement.title = title || announcement.title;
            announcement.summary = summary || announcement.summary;
            announcement.details = details || announcement.details;
            announcement.date = date || announcement.date;
            announcement.color = color || announcement.color;
            announcement.isActive = isActive !== undefined ? isActive : announcement.isActive;

            const updatedAnnouncement = await announcement.save();

            const now = new Date();
            const year = now.getFullYear(); // e.g., 2025
            const academicYear = `${year}-${(year + 1).toString().slice(-2)}`; // e.g., "2025-26"

            try {
                await logActivity(
                    user,
                    'Update Announcement',
                    `Announcement ID: ${announcement._id}, Department: NA`,
                     `created ${academicYear}`,
                    req.ip
                );
            } catch (logError) {
                console.warn(`⚠️ Activity log failed for Announcement ${req.params.id}:`, logError.message);
            }

            res.json(updatedAnnouncement);
        } else {
            res.status(404).json({ message: 'Announcement not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating announcement', error: error.message });
    }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        const user=req.user;
        if (announcement) {
            await announcement.deleteOne();
            const now = new Date();
            const year = now.getFullYear(); // e.g., 2025
            const academicYear = `${year}-${(year + 1).toString().slice(-2)}`; // e.g., "2025-26"

            try {
                await logActivity(
                    user,
                    'Delete Announcement',
                    `Announcement ID: ${announcement._id}, Department: NA`,
                    `created ${academicYear}`,
                    req.ip
                );
            } catch (logError) {
                console.warn(`⚠️ Activity log failed for announcement ${req.params.id}:`, logError.message);
            }

            res.json({ message: 'Announcement removed' });
        } else {
            res.status(404).json({ message: 'Announcement not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAnnouncements,
    getActiveAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
};