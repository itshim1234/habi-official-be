const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const pdfRoutes = require("./routes/pdfRoutes");
const quotationRoutes = require("./routes/quotationRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const otpRoutes = require("./routes/otpRoutes");

const app = express();

// 🧠 Middleware to parse JSON body
app.use(express.json());

const corsOptions = {
  origin: [
    // "http://localhost:5173",

    "https://habi.one",
    "https://www.habi.one",
    "https://habi.one/Construction-Cost-Calculator",
  ], // Or array of origins in production // Or array of origins in production
  methods: "POST",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use("/api/pdfs", express.static(path.join(__dirname, "pdfs")));
app.use("/api/images", express.static(path.join(__dirname, "images")));

app.use("/api/send-pdf", pdfRoutes);

app.use("/api/quotations/respond", quotationRoutes);
app.use("/api/consultations/respond", consultationRoutes);
app.use("/api/otp", otpRoutes);

app.get("/healthz", (req, res) => res.send("OK"));

app.listen(process.env.PORT || 4000, () =>
  console.log("🚀 Server running on port 5000")
);
