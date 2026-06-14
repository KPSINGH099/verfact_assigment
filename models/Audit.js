const mongoose = require('mongoose');
const rawSchema = require('./Audit.json'); // Import the JSON above
const {formatSchema}=require("../utility/utility.js")

const AuditSchema = new mongoose.Schema(formatSchema(rawSchema), { timestamps: true });

module.exports = mongoose.model('Audit', AuditSchema); 