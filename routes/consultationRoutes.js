const express = require("express");

const router = express.Router();

const consultationController = require("../controllers/consultationController");

router.post("/", consultationController);

module.exports = router;
