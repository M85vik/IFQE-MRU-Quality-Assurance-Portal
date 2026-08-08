/**
 * @fileoverview This controller handles CRUD operations for the Indicator model.
 * Indicators are the core assessment criteria used to build submission templates.
 * @module controllers/indicatorController
 */

const Indicator = require('../models/Indicator');
const logger = require("../utils/logger.js")
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
   
    // console.error("Error fetching all indicators:", error);

     logger.error(`Error fetching all indicators`, {
            message: error.message || "",
            stack: error.stack || "",
            controller: "indicatorController/getAllIndicators"
        }) 
   
    res.status(500).json({ message: 'Server Error' });
  }
};

// Export the controller function(s) to be used in the routes file.
module.exports = { getAllIndicators };