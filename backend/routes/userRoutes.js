/**
 * @fileoverview This file defines the API routes for user authentication and management.
 * It includes endpoints for registering new users (an admin action), logging in,
 * and fetching the profile of the currently authenticated user.
 * @module routes/userRoutes
 */

const express = require('express');
const router = express.Router();

// --- Controller and Middleware Imports ---

// Import controller functions that handle the logic for user actions.
// Note: The logic for these functions was previously in a file named 'authController.js'.
// Please ensure the path and filename are correct for your project structure.
const { registerUser, loginUser, getUserProfile,getAllUsers, updateUserRole,deleteUser} = require('../controllers/userController');

// Import middleware for authentication (protect) and role-based authorization (authorize).
const { protect, authorize } = require('../middleware/authMiddleware');


// --- Route Definitions ---

/**
 * @route   POST /api/users/register
 * @desc    Register a new user in the system.
 *          This is a protected administrative action, not a public sign-up.
 * @access  Private (Admin role only)
 *
 * Middleware Chain:
 * 1. `protect`: Ensures the request is made by a logged-in user.
 * 2. `authorize('admin')`: Ensures the logged-in user has the 'admin' role.
 */
router.post('/register', protect, authorize('admin'), registerUser);

/**
 * @route   POST /api/users/login
 * @desc    Authenticate a user with their email and password to receive a JWT.
 * @access  Public
 *          This route is intentionally public and does not use any middleware,
 *          as it is the main entry point for all users to get authenticated.
 */
router.post('/login', loginUser);

/**
 * @route   GET /api/users/profile
 * @desc    Get the profile information of the currently logged-in user.
 * @access  Private (Any authenticated user)
 *
 * Middleware Chain:
 * 1. `protect`: Verifies the JWT and attaches the authenticated user's data to `req.user`.
 *          The `getUserProfile` controller then uses `req.user` to send back the profile.
 *          No `authorize` middleware is needed because any logged-in user can view their own profile.
 */
router.get('/profile', protect, getUserProfile);

// TODAY 
router.get("/all-users", protect,getAllUsers)

router.put("/update-role/:id", protect, updateUserRole);
router.delete("/:id", protect, deleteUser);


// Export the configured router to be mounted in the main server file.
module.exports = router;