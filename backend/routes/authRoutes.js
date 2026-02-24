const express = require("express");
const router = express.Router();

const {
  sendOTP,
  verifyOTP,
  registerAfterOTP,
  login
} = require("../controllers/authController");

// OTP Routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register-final", registerAfterOTP);

// Login Route
router.post("/login", login);

module.exports = router;
