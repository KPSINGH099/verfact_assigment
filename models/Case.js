const mongoose = require('mongoose');
const Case=require('./Case.json');
const CaseSchema = new mongoose.Schema(Case,{
    "timestamps": true
  });
module.exports = mongoose.model('Case', CaseSchema);
