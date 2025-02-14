const express = require("express");
const multer = require("multer");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const corsOptions = {
  origin: [
    "https://habi.one",
    "https://www.habi.one",
    "https://habi.one/cost-estimator",
  ],
  methods: "POST",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
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
    const name = req.body.name;

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
      html: `
        <div style="
          background-image: url('https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg'); 
          background-size: cover; 
          padding: 40px;
          text-align: center;
          font-family: Arial, sans-serif;
          color: #ffffff;
        ">
          <h2 style="color: #ffcc00;">Dear ${name},</h2>
          <p style="font-size: 18px; color: #ffffff;">
            Thank you for reaching out. Please find attached the quotation as per your request.
          </p>
          <p style="font-size: 16px; font-style: italic; color: #dddddd;">
            If you have any questions or need further clarifications, feel free to reply to this email.
          </p>
          <p style="font-size: 16px; font-weight: bold;">
            Looking forward to your response.
          </p>
          <hr style="border: 1px solid #ffcc00;">
          <p>
            <strong>Best regards,</strong> <br>
            <span style="color: #ffcc00;">Habi-DESIGNASM TECHNOLOGIES PVT. LTD.</span> <br>
            <span style="color: #ffcc00;">9606210818</span> <br>
            <a href="mailto:hello@habi.one" style="color: #ffcc00; text-decoration: none;">hello@habi.one</a>
          </p>
        </div>
      `,
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

    res.json({ message: "Quotation sent successfully!" });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).send("Error processing PDF");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
