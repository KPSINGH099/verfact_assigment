
const express = require("express");
const {
  login,
  logout,
  refreshToken,
  register,
} = require("../controller/authController.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refresh", refreshToken);
router.post("/logout", logout);

module.exports = router;