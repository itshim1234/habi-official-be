const axios = require("axios");

const sendOTP = async (req, res) => {
  const { mobile } = req.body;

  try {
    const response = await axios.post(
      "https://api.msg91.com/api/v5/otp",
      {
        mobile: `91${mobile}`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          authkey: process.env.MSG91_AUTH_KEY,
        },
      }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
};

const verifyOTP = async (req, res) => {
  const { mobile, otp } = req.body;

  try {
    const response = await axios.get(
      `https://api.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=91${mobile}`,
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
        },
      }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error(
      "Error verifying OTP:",
      error.response?.data || error.message
    );
    res.status(400).json({ success: false, error: "Invalid OTP" });
  }
};

module.exports = { sendOTP, verifyOTP };
