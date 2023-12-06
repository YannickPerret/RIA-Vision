const fs = require("fs");

class BaseImage {
  static encode(path) {
    if (!fs.existsSync(path)) {
      throw new Error("File not found");
    }
    const base64 = fs.readFileSync(path, "base64");
    const buffer = Buffer.from(base64, "base64");
    return buffer;
  }
}

module.exports = BaseImage;
