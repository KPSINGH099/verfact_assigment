const express = require('express');
const router = express.Router();
const {saveCaseToDb}=require("../controller/Case.js");
const {verifyRole}=require("../middleware/authMiddleware.js");

// @desc    Create a new case
// @route   POST /case
// @access  Public
router.post('/',verifyRole("Manager"), async (req,res,next)=>{
 let savedCase= await saveCaseToDb(req.body);
   res.json(savedCase);
}

);

module.exports = router;