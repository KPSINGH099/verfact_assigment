const express = require('express');
const router = express.Router();
const {saveAuditToDb}=require("../controller/Audit.js");

// @desc    Create a new case
// @route   POST /case
// @access  Public
router.post('/', async (req,res,next)=>{
 let savedCase= await saveAuditToDb(req.body);
   res.json(savedCase);
}

);

module.exports = router;