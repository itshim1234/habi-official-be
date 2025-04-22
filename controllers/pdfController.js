const { mergePdfs } = require("../services/pdfService");
const { sendEmailWithAttachment } = require("../services/emailService");

const sendPdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("Invoice PDF is required");

    const { package: packageName, email: userEmail, name, phone } = req.body;
    console.log(userEmail, name, "packageName:", packageName, phone);

    const mergedPdfBytes = await mergePdfs(req.file.buffer, packageName);
    await sendEmailWithAttachment(mergedPdfBytes, userEmail, name);

    res.json({ message: "Quotation sent successfully!" });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).send("Error processing PDF");
  }
};

module.exports = { sendPdf };
