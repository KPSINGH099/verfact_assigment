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
      enum: ['Manager', 'Agent'],
      default: 'Agent', // New users default to Agent
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