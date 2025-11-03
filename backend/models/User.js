/**
 * @fileoverview Defines the Mongoose schema for a User.
 * Includes password hashing middleware and a method for password comparison.
 * @module models/User
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Used for password hashing.

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  /**
   * The user's hashed password.
   * `select: false` ensures that this field is NOT returned in queries by default,
   * which is a crucial security measure.
   */
  password: { type: String, required: true, select: false },
  /**
   * The user's role, which determines their permissions within the system.
   * `enum` restricts this field to a predefined set of values.
   */
  role: {
    type: String,
    enum: ['department', 'qaa', 'admin', 'superuser'],
    required: true,
  },
  /** A reference to the department the user belongs to (if applicable). */
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  /** A reference to the school the user belongs to (if applicable). */
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
});

/**
 * Mongoose middleware that runs before a 'save' operation.
 * If the password has been modified, it hashes the new password before saving it to the database.
 */
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * An instance method on the User model to compare a plaintext password
 * with the user's stored hashed password.
 * @param {string} enteredPassword - The password to check.
 * @returns {Promise<boolean>} - True if the passwords match, false otherwise.
 */
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Creates and exports the User model.
module.exports = mongoose.model('User', UserSchema);