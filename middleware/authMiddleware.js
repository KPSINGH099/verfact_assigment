const jwt = require("jsonwebtoken");
/*
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  //console.log(authHeader)
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  // Check if the header starts with "Bearer " (case-insensitive)
  const token = authHeader.toLowerCase().startsWith("bearer ") 
  ? authHeader.split(" ")[1] 
  : authHeader;

  //console.log(token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};
*/
//handling both cookie and authorization header
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // Read the refresh token from cookies (requires cookie-parser middleware in Express)
  const refreshTokenCookie = req.cookies?.refreshToken;

  // If neither authentication method is provided, reject early
  if (!authHeader && !refreshTokenCookie) {
    return res.status(401).json({ message: "No token or session provided" });
  }

  // Case 1: Prioritize the Access Token in the Authorization header
  if (authHeader) {
    const token = authHeader.toLowerCase().startsWith("bearer ") 
      ? authHeader.split(" ")[1] 
      : authHeader;

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedUser) => {
      if (err) {
        return res.status(403).json({ message: "Invalid access token" });
      }
      req.user = decodedUser;
      return next(); // Successfully verified header token, proceed to next middleware
    });
    
  } 
  // Case 2: Fallback to the Refresh Token cookie if header isn't present
  else if (refreshTokenCookie) {
    // Note: Make sure to use your REFRESH token secret here if it differs from access token secret
    jwt.verify(refreshTokenCookie, process.env.REFRESH_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET, (err, decodedUser) => {
      if (err) {
        return res.status(403).json({ message: "Invalid session or refresh token" });
      }
      req.user = decodedUser;
      return next(); // Successfully verified cookie token, proceed to next middleware
    });
  }
};

exports.verifyRole = (role) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (userRole !== role) {
      let message=`Expected ${role} but current user has ${userRole} permission`
      return res.status(403).json({ message });
    }
    next();
  };
};