//adding document to support file upload
const mongoose = require('mongoose');
const rawSchema = require('./Document.json'); // Import the JSON above
const {formatSchema}=require("../utility/utility.js")

const DocumentSchema = new mongoose.Schema(formatSchema(rawSchema), { timestamps: true });

module.exports = mongoose.model('Document',DocumentSchema); 