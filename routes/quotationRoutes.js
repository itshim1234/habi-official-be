const express = require("express");

const router = express.Router();

const quotationController = require("../controllers/quotationController");

router.post("/", quotationController);

module.exports = router;
