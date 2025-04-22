const fs = require("fs");

function encodeImageToBase64(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString("base64");
}

module.exports = { encodeImageToBase64 };
