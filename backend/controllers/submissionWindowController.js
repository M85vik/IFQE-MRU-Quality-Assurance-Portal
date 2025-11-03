/**
 * @fileoverview This file contains the controller functions for CRUD operations
 * on Submission Windows. These windows define the timeframes for report submissions and appeals.
 * @module controllers/submissionWindowController
 */



const SubmissionWindow = require('../models/SubmissionWindow');

/**
 * A helper function to safely parse a date string in 'YYYY-MM-DD' format into a UTC Date object.
 * This ensures consistent date handling regardless of the server's local timezone.
 *
 * @param {string} dateString - The date string to parse.
 * @returns {Date|null} - A new Date object in UTC, or null if the format is invalid.
 */
const parseDateString = (dateString) => {
    // Basic validation for input type.
    if (!dateString || typeof dateString !== 'string') return null;

    const parts = dateString.split('-');
    if (parts.length !== 3) return null;
    
    const year = parseInt(parts[0], 10);
    // The month in JavaScript's Date constructor is 0-indexed (0=Jan, 11=Dec),
    // so we must subtract 1 from the parsed month.
    const month = parseInt(parts[1], 10) - 1; 
    const day = parseInt(parts[2], 10);

    // Ensure all parts are valid numbers.
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

    // Use Date.UTC to create a timezone-agnostic date object.
    return new Date(Date.UTC(year, month, day));
};

/**
 * @desc    Get all submission windows.
 * @route   GET /api/submission-windows
 * @access  Private/Admin
 */
const getSubmissionWindows = async (req, res) => {
    try {
        // Fetch all windows and sort them.
        // Sorting by academicYear descending shows the most recent years first.
        // Sorting by windowType ascending ensures a consistent order (e.g., Appeal then Submission).
        const windows = await SubmissionWindow.find({}).sort({ academicYear: -1, windowType: 1 });
        res.json(windows);
    } catch (error) {
        console.error('Error fetching submission windows:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Create a new submission window.
 * @route   POST /api/submission-windows
 * @access  Private/Admin
 */
const createSubmissionWindow = async (req, res) => {
    const { academicYear, startDate, endDate, windowType } = req.body;
    try {
        const start = parseDateString(startDate);
        const end = parseDateString(endDate);

        if (!start || !end) {
            return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD.' });
        }
        
        // Business Logic: Set the end date to the very end of the day (23:59:59.999).
        // This makes the window inclusive of the entire final day.
        end.setUTCHours(23, 59, 59, 999);

        const newWindow = await SubmissionWindow.create({ academicYear, startDate: start, endDate: end, windowType });
        res.status(201).json(newWindow);
    } catch (error) {
        // This error is often triggered by the unique compound index on {academicYear, windowType}
        // in the SubmissionWindow model, preventing duplicates.
        console.error('Error creating submission window:', error);
        res.status(400).json({ message: 'Error creating window. A window of this type for the academic year might already exist.', error: error.message });
    }
};

/**
 * @desc    Update an existing submission window by its ID.
 * @route   PUT /api/submission-windows/:id
 * @access  Private/Admin
 */
const updateSubmissionWindow = async (req, res) => {
    const { academicYear, startDate, endDate, windowType } = req.body;
    try {
        const window = await SubmissionWindow.findById(req.params.id);

        if (window) {
            // Update fields only if they are provided in the request body.
            window.academicYear = academicYear || window.academicYear;
            window.windowType = windowType || window.windowType;
            
            if (startDate) {
                const start = parseDateString(startDate);
                if (start) window.startDate = start;
            }
            if (endDate) {
                const end = parseDateString(endDate);
                if (end) {
                    // Apply the same end-of-day logic as in the create function.
                    end.setUTCHours(23, 59, 59, 999);
                    window.endDate = end;
                }
            }
            
            // Save the updated document. This will trigger Mongoose validation.
            const updatedWindow = await window.save();
            res.json(updatedWindow);
        } else {
            res.status(404).json({ message: 'Submission window not found' });
        }
    } catch (error) {
        // This can also be triggered by the unique index if the update creates a conflict.
        console.error(`Error updating submission window ${req.params.id}:`, error);
        res.status(400).json({ message: 'Error updating submission window. The update may have caused a duplicate entry.', error: error.message });
    }
};

/**
 * @desc    Delete a submission window by its ID.
 * @route   DELETE /api/submission-windows/:id
 * @access  Private/Admin
 */
const deleteSubmissionWindow = async (req, res) => {
    try {
        const window = await SubmissionWindow.findById(req.params.id);

        if (window) {
            await window.deleteOne(); // Use .deleteOne() on the document instance.
            res.json({ message: 'Submission window removed successfully' });
        } else {
            res.status(404).json({ message: 'Submission window not found' });
        }
    } catch (error) {
        console.error(`Error deleting submission window ${req.params.id}:`, error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Export all controller functions.
module.exports = {
    getSubmissionWindows,
    createSubmissionWindow,
    updateSubmissionWindow,
    deleteSubmissionWindow,
};