const Case = require('../models/Audit.js');

/**
 * Business logic to save a new case to MongoDB
 * @param {Object} caseData - The body data sent by the user
 * @returns {Promise<Object>} The saved database document
 */
const saveAuditToDb = async (caseData) => {
  console.log(caseData)
  // Create a new instance of the Case model with the provided data
  const newCase = new Case(caseData);
  
  // Save it to the database
  const savedCase = await newCase.save();
  
  return savedCase;
};

module.exports = { saveAuditToDb};