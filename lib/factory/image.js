const fs = require("fs");

class BaseImage {
  static encode(path, encoding = "base64") {
    const base64 = fs.readFileSync(path, encoding);
    const buffer = Buffer.from(base64, encoding);
    return buffer;
  }
}

module.exports = BaseImage;
