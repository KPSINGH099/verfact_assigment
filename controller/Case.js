const Case = require('../models/Case');
const User =require('../models/User');

/**
 * Business logic to save a new case to MongoDB
 * @param {Object} caseData - The body data sent by the user
 * @returns {Promise<Object>} The saved database document
 */

//Now Manager can directly create case and assign to user
const saveCaseToDb = async (caseData,next) => {
  /*
  console.log(caseData)
 
  const assigne=caseData.assigne;
  const foundUser = await User.findOne({ userid: assigne });

   if (!foundUser) {
    const error = new Error(`User with ID '${assigne}' not found`);
    error.name = "BadRequestError"; // Triggers 400 Bad Request in your custom middleware
    return next(error);
  }
  caseData.assignedTo=foundUser._id;
*/
  const newCase = new Case(caseData);
  
  // Save it to the database
  const savedCase = await newCase.save();
  
  return savedCase;
};

//or create the case first then assign to some user 
const updateCaseAsigneToDb = async (caseId,updateData,next) => {
  //console.log(caseData)
 
  const assigne=updateData.assigne;
  updateData.status="Assigned";
  const foundUser = await User.findOne({ userid: assigne });

   if (!foundUser) {
    const error = new Error(`User with ID '${assigne}' not found`);
    error.name = "BadRequestError"; // Triggers 400 Bad Request in your custom middleware
    return next(error);
  }
  updateData.assignedTo=foundUser._id;

  const updatedCase = await Case.findByIdAndUpdate(
    caseId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  // 3. Handle case where the document ID does not exist
  if (!updatedCase) {
    const error = new Error(`Case with ID '${caseId}' not found`);
    error.name = "BadRequestError";
    next(error);
    return null;
  }

  return updatedCase;
};


//get all task assigned to user
const getCaseAsigneTome = async (
assigne,next) => {
  //console.log(caseData)
 
   const cases = await Case.find({ 
assigne:
assigne});

   if (!cases) {
    const error = new Error(`Nothing is assign to  user with ID '${
assigne}' `);
    error.name = "BadRequestError"; // Triggers 400 Bad Request in your custom middleware
    return next(error);
  }


  return cases;
};

//update case status
const updateCaseStatus = async (caseId,updateData,next) => {
  //console.log(caseData)
 
    //let status=updateData.status;
    const updatedCase = await Case.findByIdAndUpdate(
    caseId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  // 3. Handle case where the document ID does not exist
  if (!updatedCase) {
    const error = new Error(`Case with ID '${caseId}' not found`);
    error.name = "BadRequestError";
    next(error);
    return null;
  }

  return updatedCase;
};

module.exports = { saveCaseToDb,updateCaseAsigneToDb,getCaseAsigneTome,updateCaseStatus};