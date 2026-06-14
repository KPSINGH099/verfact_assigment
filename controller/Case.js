const Case = require('../models/Case');
const User =require('../models/User');

/**
 * Business logic to save a new case to MongoDB
 * @param {Object} caseData - The body data sent by the user
 * @returns {Promise<Object>} The saved database document
 */
const saveCaseToDb = async (caseData,next) => {
  console.log(caseData)
 
  const assigne=caseData.assigne;
  const foundUser = await User.findOne({ userid: assigne });

   if (!foundUser) {
    const error = new Error(`User with ID '${assigne}' not found`);
    error.name = "BadRequestError"; // Triggers 400 Bad Request in your custom middleware
    return next(error);
  }
  caseData.assignedTo=foundUser._id;

  const newCase = new Case(caseData);
  
  // Save it to the database
  const savedCase = await newCase.save();
  
  return savedCase;
};

module.exports = { saveCaseToDb };