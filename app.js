require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const caseRoutes = require('./routes/caseRoutes.js');
const commentRoutes=require('./routes/commentRoutes.js');
const cookieParser = require("cookie-parser");
const auditRoutes=require('./routes/auditRoutes.js');
const authRoutes=require("./routes/auth.js");
const {errorHandler}=require('./middleware/errorHandler.js');
const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(express.json());
app.use(cookieParser());

// Basic Route
app.get('/hearbeat', (req, res) => {
  res.send('API is running successfully!');
});
app.use("/api/auth", authRoutes);
app.use('/case', caseRoutes);
app.use('/comment', commentRoutes);
app.use('/audit',auditRoutes);
app.use(errorHandler);
//app.use();
// Logic to start the app
const start = async () => {
  try {
    // Connect to Database
    await connectDB();
    
    // Start Server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start the application: ${error.message}`);
  }
};

// Export the start function
module.exports = { start };