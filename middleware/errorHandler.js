const errorHandler = (err, req, res, next) => {
  // Check if the error is a Mongoose validation error
  if (err.name === 'ValidationError') {
    
    // Grab the first validation error message encountered
    const firstErrorKey = Object.keys(err.errors)[0];
    const customMessage = err.errors[firstErrorKey].message;

    return res.status(400).json({
      status: 400,
      code: "VALIDATION_ERROR",
      message: customMessage
    });
  }

if (err.name === 'BadRequestError') {
    return res.status(400).json({
      status: 400,
      code: "VALIDATION_ERROR",
      message: err.message
    });
  }

  // Fallback for other unhandled internal server errors
  return res.status(500).json({
    status: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: err.message || "Something went wrong on the server."
  });
};

module.exports={
  errorHandler 
}