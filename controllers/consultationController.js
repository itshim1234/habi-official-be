const googleSheetService = require("../services/googleSheetService");
const userConsultationDataValidator = require("../validators/userConsultationDataValidator");
const consultationController = async (req, res) => {
  try {
    const { isValid, errors } = userConsultationDataValidator(req.body);
    console.log("data", req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors,
      });
    }

    const consultationData = {
      Timestamp: new Date().toISOString(),
      "Email address": req.body.email || "",
      Name: req.body.name || "",
      "Mobile Number": req.body.phone || "",
      Location: req.body.location || "",
    };
    console.log(consultationData);

    const response = await googleSheetService(consultationData, "consultation");
    console.log("proxyy", response);

    if (response.status === "success") {
      res.status(200).json({
        success: true,
        message: "Consultation data saved successfully",
        response: response.data,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (e) {
    console.error("Controller error:", e);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

module.exports = consultationController;
