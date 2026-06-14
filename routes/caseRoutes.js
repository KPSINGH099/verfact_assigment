const express = require('express');
const router = express.Router();
const {saveCaseToDb,updateCaseAsigneToDb,getCaseAsigneTome,updateCaseStatus}=require("../controller/Case.js");
const {verifyRole}=require("../middleware/authMiddleware.js");

// @desc    Create a new case
// @route   POST /case
// @access  Public
// 1. Make this callback function async
//for creating task i dont need asignee 
router.post('/', verifyRole("Manager"), async (req, res, next) => {
  try {
    console.log(req.user);
    const reviewer=req.user?.userid;
     req.body.reviewer=reviewer;
    let savedCase = await saveCaseToDb(req.body, next);
    
    // 3. Only send this response if a case was successfully saved
    if (savedCase) {
      return res.status(201).json(savedCase);
    }
  } catch (error) {
    return next(error);
  }
});

//user assigning case to Agent
router.patch('/:caseId',verifyRole("Manager"), async (req, res, next) => {
  try {
    let caseId=req.params.caseId;
    let savedCase = await updateCaseAsigneToDb(caseId,req.body, next);
    
    // 3. Only send this response if a case was successfully saved
    if (savedCase) {
      return res.status(200).json(savedCase);
    }
  } catch (error) {
    return next(error);
  }
});

//show all case assigne to particular agent
router.get('/', async (req, res, next) => {
  try {
    
    //fetching based on user id
    const assignedTo=req.user?.userid;
    let totalCases = await getCaseAsigneTome(assignedTo,next);
    
    // 3. Only send this response if a case was successfully saved
    if (totalCases) {
      return res.status(200).json(totalCases);
    }
  } catch (error) {
    return next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    let caseId=req.body.caseId;
    if(!caseId){
          const error = new Error(`${caseId} is Mandatory field`);
    error.name = "BadRequestError"; // Triggers 400 Bad Request in your custom middleware
    return next(error);
    }
    let savedCase = await updateCaseStatus(caseId,req.body, next);
    
    // 3. Only send this response if a case was successfully saved
    if (savedCase) {
      return res.status(200).json(savedCase);
    }
  } catch (error) {
    return next(error);
  }
});


module.exports = router;