const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { sendPdf } = require("../controllers/pdfController");

router.post("/", upload.single("invoicePdf"), sendPdf);

module.exports = router;
