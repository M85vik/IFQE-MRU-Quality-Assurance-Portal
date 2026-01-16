/**
 * @fileoverview This file contains the controller functions for user authentication,
 * including registration, login, and fetching user profiles.
 * @module controllers/authController
*/

const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const logActivity = require("../utils/logActivity")
/**
 * @desc    Register a new user.
 * @route   POST /api/users/register
 * @access  Public
 * @param   {object} req - The Express request object.
 * @param   {object} req.body - The body of the request containing user details (name, email, password, role, etc.).
 * @param   {object} res - The Express response object.
 * @returns {json} 201 - A JSON object with the new user's data and a JWT.
 * @returns {json} 400 - If the email already exists or if user data is invalid.
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department, school } = req.body;

    // 1. Check if a user with the given email already exists to prevent duplicates.
    const userExists = await User.findOne({ email });
    if (userExists) {
      // If the user exists, return a 400 Bad Request status.
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 2. Create a new user in the database with the provided details.
    // The password will be automatically hashed by the Mongoose pre-save hook in the User model.
    const user = await User.create({ name, email, password, role, department, school });
  
   
    const now = new Date();
    const year = now.getFullYear(); // e.g., 2025
    const academicYear = `${year}-${(year + 1).toString().slice(-2)}`; // e.g., "2025-26"



    try {
      await logActivity(
       req.user,
        'Create User',
        `User ID: ${req.user._id}, Department: ${req.user?.department || 'NA'}`,
        `created ${academicYear}`,
        req.ip
      );
    } catch (logError) {
      console.warn(`⚠️ Activity log failed for User ${req.user._id}:`, logError.message);
    }

    // 3. If user creation is successful, send back the user's details and a JWT.
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id), // Generate a JWT for the new user.
      });
    } else {
      // This case handles potential Mongoose validation errors during creation.
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    console.error(`Error in registerUser: ${error.message}`);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * @desc    Authenticate a user and get a JWT.
 * @route   POST /api/users/login
 * @access  Public
 * @param   {object} req - The Express request object.
 * @param   {object} req.body - The body containing the user's email and password.
 * @param   {object} res - The Express response object.
 * @returns {json} 200 - A JSON object with the logged-in user's data and a JWT.
 * @returns {json} 401 - If credentials (email or password) are invalid.
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by their email.
    // We must explicitly request the password with `.select('+password')` because
    // the User model schema is set to `select: false` for security.
    const user = await User.findOne({ email }).select('+password');

    // 2. Check if the user exists and if the provided password matches the stored hash.
    // `matchPassword` is a custom method defined on the User model.
    if (user && (await user.matchPassword(password))) {
      // 3. If credentials are valid, send back user data and a new JWT.

      const now = new Date();
    const year = now.getFullYear(); // e.g., 2025
    const academicYear = `${year}-${(year + 1).toString().slice(-2)}`; // e.g., "2025-26"

const sanitizedUser = user.toObject();
delete sanitizedUser.password;

    try {
      await logActivity(
       sanitizedUser,
        'User LoggedIn',
        `User ID: ${user._id}, Department: ${user?.department || 'NA'}`,
        `created ${academicYear}`,
        req.ip
      );
    } catch (logError) {
      console.warn(`⚠️ Activity log failed for User ${req.user._id}:`, logError.message);
    }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        school: user.school,
        token: generateToken(user._id),
      });
    } else {
      // Security Best Practice: Use a generic error message to prevent attackers
      // from knowing whether an email address is registered in the system.
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(`Error in loginUser: ${error.message}`);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * @desc    Get the profile of the currently logged-in user.
 * @route   GET /api/users/profile
 * @access  Private (Requires a valid JWT)
 * @param   {object} req - The Express request object. `req.user` is populated by the auth middleware.
 * @param   {object} res - The Express response object.
 * @returns {json} 200 - A JSON object containing the user's profile information.
 */
const getUserProfile = async (req, res) => {
  // The user object is attached to the request (`req.user`) by the authentication middleware
  // after it successfully verifies the JWT from the request headers.
  // We can safely assume `req.user` exists in this protected route.
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};



const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password -__v');
    return res.status(200).json(users);
  } catch (error) {
    console.error(`Error in Getting Users: ${error.message}`);
    res.status(500).json({ message: 'Error Fetching All Users.' });
  }

}




const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ message: 'Role is required.' });
  }
  try {

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.role = role;
    await user.save();


    const now = new Date();
    const year = now.getFullYear(); // e.g., 2025
    const academicYear = `${year}-${(year + 1).toString().slice(-2)}`; // e.g., "2025-26"
    try {
      await logActivity(
        req.user,
        'Update User',
        `User ID: ${req.user._id}, Department: ${req.user?.department || 'NA'}`,
        `updated ${academicYear}`,
        req.ip
      );
    } catch (logError) {
      console.warn(`⚠️ Activity log failed for User ${req.params.id}:`, logError.message);
    }

    return res.status(200).json({ message: 'Role updated successfully.', user });
  } catch (error) {
    console.error(`Error Updating User: ${error.message}`);
    res.status(500).json({ message: 'Error Updating User.' });
  }
};




const updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const { password, masterKey } = req.body;

  if (!password) {
    return res.status(400).json({
      message: 'Password is Required.',
    });
  }

  const MASTER_KEY = process.env.MASTER_KEY;
  if (
    !masterKey ||
    !crypto.timingSafeEqual(
      Buffer.from(masterKey),
      Buffer.from(MASTER_KEY)
    )
  ) {
    return res.status(403).json({ message: 'Invalid master key.' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.password = password;
    await user.save();

    const year = new Date().getFullYear();
    const academicYear = `${year}-${(year + 1).toString().slice(-2)}`;

    try {
      await logActivity(
        req.user,
        'Update User Password',
        `User ID: ${user._id}, Department: ${req.user?.department || 'NA'}`,
        `updated ${academicYear}`,
        req.ip
      );
    } catch (logError) {
      console.warn('⚠️ Activity log failed:', logError.message);
    }

    return res.status(200).json({
      message: 'Password updated successfully.',
    });
  } catch (error) {
    console.error('Error Updating User:', error.message);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

// ✅ Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    await user.deleteOne();
    const now = new Date();
    const year = now.getFullYear(); // e.g., 2025
    const academicYear = `${year}-${(year + 1).toString().slice(-2)}`; // e.g., "2025-26"
    try {
      await logActivity(
        req.user,
        'Deleted User',
        `User ID: ${req.user._id}, Department: ${req.user?.department || 'NA'}`,
        `deleted ${academicYear}`,
        req.ip
      );
    } catch (logError) {
      console.warn(`⚠️ Activity log failed for User ${req.params.id}:`, logError.message);
    }

    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error(`Error Deleting User: ${error.message}`);
    res.status(500).json({ message: 'Error Deleting User.' });

  }
};


// Export the controller functions to be used in the user routes file.
module.exports = { registerUser, loginUser, getUserProfile, getAllUsers, updateUserRole, updateUserPassword,deleteUser };