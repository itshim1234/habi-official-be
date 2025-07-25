const mongoose = require('mongoose');

const contentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['h2', 'p'],
    required: true,
  },
  value: {
    type: String,
    required: true,
  }
}, { _id: false });

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: [contentBlockSchema], // h2, p, etc.
    required: true,
  },
  imageUrls: {
    type: [String], // direct image links (https://example.com/image.jpg)
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Post', postSchema);