const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const axios = require("axios");
const mongoose = require("mongoose");
const {connect} =require("./db")

dotenv.config();

const pdfRoutes = require("./routes/pdfRoutes");
const quotationRoutes = require("./routes/quotationRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const otpRoutes = require("./routes/otpRoutes");
const blogRoutes=require("./routes/blogRoutes")

const app = express();

// 🧠 Middleware to parse JSON body
app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:5175",
    "http://192.168.0.5:5175",     // 👈 ADD THIS
    "http://192.168.0.100:5175",   // 👈 OR mobile IPs if needed
    "https://habi.one",
    "https://www.habi.one",
    "https://habi.one/Construction-Cost-Calculator",
  ],
  methods: "POST,GET,PUT,DELETE,OPTIONS",   // 👈 allow more methods
  allowedHeaders: ["Content-Type", "Authorization"],
};


// app.use(cors());


app.use(cors(corsOptions));

app.use("/api/pdfs", express.static(path.join(__dirname, "pdfs")));
app.use("/api/images", express.static(path.join(__dirname, "images")));

app.use("/api/send-pdf", pdfRoutes);

app.use("/api/quotations/respond", quotationRoutes);
app.use("/api/consultations/respond", consultationRoutes);
app.use("/api/otp", otpRoutes);


app.use("/api/v1",blogRoutes);

app.get("/healthz", (req, res) => res.send("OK"));

app.get('/api/v1/test', (req, res) => {
  res.send("Hello from backend!");
});


connect();

app.listen(process.env.PORT || 4000, () =>
  console.log("🚀 Server running on port ",process.env.PORT )
);


// app.listen(5175, '0.0.0.0', () => {
//   console.log("Server running on http://192.168.0.5:5175");
// });
