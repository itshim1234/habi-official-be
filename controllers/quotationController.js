const googleSheetService = require("../services/googleSheetService");
const userQuotationDataValidator = require("../validators/userQuotationDataValidator");
const quotationController = async (req, res) => {
  try {
    const { isValid, errors } = userQuotationDataValidator(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors,
      });
    }

    const quotationData = {
      Timestamp: new Date().toISOString(),
      "Email address": req.body.email || "",
      Name: req.body.name || "",
      "Mobile Number": req.body.phone || "",
      "Site Location": req.body.location || "",
      Dimensions: req.body.dimensions || "",
      "Vastu Required": req.body.vastu || "",
      Orientation: req.body.orientation || "",
      "Site Facing": req.body.siteFacing || "",
      "Type of Building": req.body.buildingType || "",
      "No of Floors": req.body.floors || "",
      Purpose: req.body.purpose || "",
      Requirements: req.body.requirements || "",
      Starting: req.body.starting || "",
    };

    const response = await googleSheetService(quotationData, "quotation");

    if (response.status === "success") {
      res.status(200).json({
        success: true,
        message: "Quotation data saved successfully",
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

module.exports = quotationController;
