const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Member'],
      default: 'Admin', // New users default to Admin
    },
    refreshToken: {
      type: String,
      default: null, // Starts as null until they log in or get assigned a session
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("User", userSchema);