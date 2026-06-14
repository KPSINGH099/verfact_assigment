require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const caseRoutes = require('./routes/caseRoutes.js');
const commentRoutes=require('./routes/commentRoutes.js');
const auditRoutes=require('./routes/auditRoutes.js')
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Basic Route
app.get('/hearbeat', (req, res) => {
  res.send('API is running successfully!');
});
app.use('/case', caseRoutes);
app.use('/comment', commentRoutes);
app.use('/audit',auditRoutes);
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