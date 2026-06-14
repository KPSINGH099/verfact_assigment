const express = require('express');
const router = express.Router();
const {saveCommentToDb}=require("../controller/Comment.js");

// @desc    Create a new case
// @route   POST /case
// @access  Public
router.post('/', async (req,res,next)=>{
 let savedCase= await saveCommentToDb(req.body);
   res.json(savedCase);
}

);

module.exports = router;