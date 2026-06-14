const mongoose = require('mongoose');
const rawSchema = require('./Comment.json'); // Import the JSON above
const {formatSchema}=require("../utility/utility.js")

const CommentSchema = new mongoose.Schema(formatSchema(rawSchema), { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema); 