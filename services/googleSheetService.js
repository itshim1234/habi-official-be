const axios = require("axios");

const googleSheetService = async (formData, sheetType) => {
  try {
    const GOOGLE_SCRIPT_URL =
      sheetType === "quotation"
        ? process.env.GOOGLE_SCRIPT_URL_QUOTATION
        : process.env.GOOGLE_SCRIPT_URL_CONSULTATION;

    const response = await axios.post(GOOGLE_SCRIPT_URL, formData, {
      headers: {
        "Content-Type": "application/json", // ✅ JSON header
      },
    });
    return {
      status: "success",
      data: response.data,
    };
  } catch (error) {
    console.error("Google Sheet Error:", error.response?.data || error.message); // 👈 this will now log
    return {
      status: "error",
      error: error.message,
    };
  }
};

module.exports = googleSheetService;
