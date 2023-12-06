const BaseImage = require("./image");
const BaseUrl = require("./url");
const sharp = require("sharp");

class Factory {
  static async encode(element) {
    if (typeof element === "string" && (element.startsWith("http") || element.startsWith("https"))) {
      if (element.endsWith('.webp')) {
        const buffer = await BaseUrl.encode(element);
        return sharp(buffer).toFormat('png').toBuffer();
      }
      return await BaseUrl.encode(element);
    } else if (typeof element === "string" && element.match(/\.jpg|\.png|\.svg$/)) {
      return BaseImage.encode(element);
    } else {
      throw new Error("Invalid input");
    }
  }
}

module.exports = Factory;
