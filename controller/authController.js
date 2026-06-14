const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  const { userid, role, password } = req.body;

  if (!userid || !role || !password) {
    const error = new Error("User ID, role, and password are required");
    error.name = "BadRequestError"; // Give it a name our middleware can recognize
    return next(error);
  }

  try {
    const existingUser = await User.findOne({ userid });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      userid,
      role,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        userid: user.userid,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { userid, password } = req.body;

  if (!userid || !password) {
    return res.status(400).json({ message: "userid and password are required" });
  }

  try {
    const user = await User.findOne({ userid });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        userid:user.userid 
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        userid:user.userid 
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        userid: user.userid,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    // 1. Verify the token signature and expiration
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
    // 2. Find the user by ID
    const user = await User.findById(decoded.id);

    // Security Check A: If user doesn't exist at all
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Security Check B: REUSE DETECTION
    if (user.refreshToken !== token) {
      // BREACH DETECTED: Someone is reusing an old token!
      user.refreshToken = null;
      await user.save();
      
      res.clearCookie('refreshToken');
      return res.status(403).json({ message: "Compromised session. Please log in again." });
    }

    // 3. Generate a BRAND NEW Access Token
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // 4. ROTATION: Generate a BRAND NEW Refresh Token
    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Save the brand new refresh token to the database
    user.refreshToken = newRefreshToken;
    await user.save();

    // 6. Send the new refresh token in a secure HTTP-only cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // 7. Send the response
    res.status(200).json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        userid: user.userid,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Error refreshing token:", error);
    
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
    
    return res.status(500).json({ message: "Server error" });
  }
};

exports.logout = (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};