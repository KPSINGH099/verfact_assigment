/*const mongoose = require('mongoose');
const Case=require('./Case.json');
const CaseSchema = new mongoose.Schema(Case,{
    "timestamps": true
  });
module.exports = mongoose.model('Case', CaseSchema);*/

const mongoose = require('mongoose');
const rawSchema = require('./Case.json'); // Import the JSON above
const {formatSchema}=require("../utility/utility.js")

const  CaseSchema= new mongoose.Schema(formatSchema(rawSchema), { timestamps: true });

module.exports = mongoose.model('Case', CaseSchema);