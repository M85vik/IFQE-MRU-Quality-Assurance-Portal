/**
 * @fileoverview This controller handles CRUD operations for the Indicator model.
 * Indicators are the core assessment criteria used to build submission templates.
 * @module controllers/indicatorController
 */

const Indicator = require('../models/Indicator');

/**
 * @desc    Get all indicators from the database.
 * @route   GET /api/indicators
 * @access  Private (typically accessed by admins or when creating new submissions)
 * @param   {object} req - The Express request object.
 * @param   {object} res - The Express response object.
 * @returns {json} 200 - An array of all indicator objects.
 * @returns {json} 500 - If a server error occurs during the database query.
 */
const getAllIndicators = async (req, res) => {
  try {
    // Find all documents in the Indicator collection. The empty object {} means no filter.
    // .sort('indicatorCode') ensures the indicators are returned in a logical, ascending order (e.g., 1.1.1, 1.1.2, 1.2.1).
    const indicators = await Indicator.find({}).sort('indicatorCode'); 
    
    // Send the array of indicators back to the client.
    res.json(indicators);
  } catch (error) {
    // Log the error on the server for debugging purposes.
    console.error("Error fetching all indicators:", error);
    // Send a generic server error message to the client.
    res.status(500).json({ message: 'Server Error' });
  }
};

// Export the controller function(s) to be used in the routes file.
module.exports = { getAllIndicators };