const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerConfig");
const {createPost,getAllBlogs} = require("../controllers/blogControllers");

router.post("/create", createPost);

router.get("/blogs", getAllBlogs);

module.exports = router;
