const express = require("express");
const multer = require("multer");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use("/pdfs", express.static(path.join(__dirname, "pdfs")));

// Multer setup for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Package-to-PDF mapping
const packageMap = {
  Essential: path.join(__dirname, "pdfs", "Essential.pdf"),
  Premium: path.join(__dirname, "pdfs", "Premium.pdf"),
  Luxury: path.join(__dirname, "pdfs", "Luxury.pdf"),
  EssentialPlus: path.join(__dirname, "pdfs", "EssentialPlus.pdf"),
  PremiumPlus: path.join(__dirname, "pdfs", "PremiumPlus.pdf"),
  LuxuryPlus: path.join(__dirname, "pdfs", "LuxuryPlus.pdf"),
};

// Email configuration (replace with your credentials)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or App password
  },
});

// Route to handle PDF merging and emailing
app.post("/send-pdf", upload.single("invoicePdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("Invoice PDF is required");

    const packageName = req.body.package;
    const userEmail = req.body.email;

    if (!packageMap[packageName])
      return res.status(400).send("Invalid package");

    // Load the uploaded invoice PDF
    const invoicePdfBuffer = req.file.buffer;
    const invoicePdf = await PDFDocument.load(invoicePdfBuffer);

    // Load the selected package PDF
    const packagePdfBuffer = fs.readFileSync(packageMap[packageName]);
    const packagePdf = await PDFDocument.load(packagePdfBuffer);

    // Merge the PDFs
    const mergedPdf = await PDFDocument.create();

    // Copy pages from Invoice PDF
    const invoicePages = await mergedPdf.copyPages(
      invoicePdf,
      invoicePdf.getPageIndices()
    );
    invoicePages.forEach((page) => mergedPdf.addPage(page));

    // Copy pages from the selected package PDF
    const packagePages = await mergedPdf.copyPages(
      packagePdf,
      packagePdf.getPageIndices()
    );
    packagePages.forEach((page) => mergedPdf.addPage(page));

    // Generate merged PDF buffer
    const mergedPdfBytes = await mergedPdf.save();

    // Create email with merged PDF attachment
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Your Quotation PDF",
      text: "Attached is your merged quotation document.",
      attachments: [
        {
          filename: "Quotation.pdf",
          content: Buffer.from(mergedPdfBytes),
          contentType: "application/pdf",
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ message: "PDF merged and sent successfully!" });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).send("Error processing PDF");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
