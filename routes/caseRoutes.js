const express = require('express');
const router = express.Router();
const {saveCaseToDb}=require("../controller/Case.js");
const {verifyRole}=require("../middleware/authMiddleware.js");

// @desc    Create a new case
// @route   POST /case
// @access  Public
// 1. Make this callback function async
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



module.exports = router;