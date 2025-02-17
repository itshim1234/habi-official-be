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
app.use("/images", express.static(path.join(__dirname, "images")));

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
        <div
          style="max-width: 400px; height: 566px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); font-family: 'Poppins', Arial, sans-serif;">
    
          <!-- Top Section with Centered Logo -->
          <div style="display: flex; justify-content: center; align-items: center; height: 90px;">
            <img src="/images/Logo.png" alt="Habi Logo" style="max-width: 140px; padding-top: 40px;">
          </div>
    
          <!-- Content Section -->
          <div
            style="position: relative; background: url('/images/bg.png') no-repeat center center; padding-left: 40px; padding-right: 40px; text-align: center; color: #333333; height: 460px;">
            <h2 style="font-size: 18px; color: #000000; padding-top: 40px;">Dear ${name},</h2>
            <p style="font-size: 14px; padding-top: 8px;">
              Thank you for reaching out. <br> Please find attached the quotation as per your request.
            </p>
            <p style="font-size: 12px; font-style: italic; color: #7c7c7c; padding-top: 30px;">
              If you have any questions or need further clarifications, feel free to reply to this email.
            </p>
            <p style="position: relative; font-size: 16px; font-weight: bold; color: #0FB4C3; padding-top: 8px;">
              Looking forward to your response
              <img src="/images/star.png" style="position: absolute; top: 0;" alt="">
              <img src="/images/star.png" style="position: absolute; top: -5px; right: 5px; width: 10px; opacity: 0.5;" alt="">
            </p>
    
            <p style="font-size: 14px; margin-bottom: 0em; margin-top: 0.3em; padding-top: 30px;">Best regards,</p>
            <p style="font-size: 14px; margin-bottom: 0em; margin-top: 0.3em;">habi homes</p>
            <p style="font-size: 14px; margin-bottom: 0em; margin-top: 0.3em;">9606210818</p>
            <p style="font-size: 14px; margin-bottom: 0em; margin-top: 0.3em;"><a href="mailto:hello@habi.one" style="color: #000000; text-decoration: none;">hello@habi.one</a></p>
    
            <div style="bottom: 0; text-align: center; padding-top: 40px;">
              <p style="font-size: 14px; margin-bottom: 0em; margin-top: 0.3em; color: #7c7c7c;">↓ Quotation here ↓</p>
            </div>
            <img src="/images/line.png" alt="" style="position: absolute; top: 0; left: 20px;">
          </div>
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
