const express = require("express");

const router = express.Router();

const { sendOTP, verifyOTP } = require("../controllers/otp");

// @route   POST /otp/send
// @desc    Send OTP to mobile
router.post("/send", sendOTP);

// @route   POST /otp/verify
// @desc    Verify entered OTP
router.post("/verify", verifyOTP);

module.exports = router;
