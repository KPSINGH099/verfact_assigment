const jwt = require("jsonwebtoken");

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