



    const Post = require("../models/Post");



const createPost = async (req, res) => {
  try {
    const { title, content, imageUrls } = req.body;

    console.log(imageUrls)

    const parsedImageUrls =
      
         Array.isArray(imageUrls)
        ? imageUrls
        : [];

    const blog = new Post({
      title,
      content,
      imageUrls: parsedImageUrls,
    });

    await blog.save();

    res.status(201).json({ success: true, blog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};





const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Post.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



module.exports={createPost,getAllBlogs}

