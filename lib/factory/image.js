const fs = require("fs");

class BaseImage {
  static encode(path, encoding = "base64") {
    if (!fs.existsSync(path)) {
      throw new Error("File not found");
    }
    const base64 = fs.readFileSync(path, encoding);
    const buffer = Buffer.from(base64, encoding);
    return buffer;
  }
}

module.exports = BaseImage;
