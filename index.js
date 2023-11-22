const fs = require("fs");
const AWSClient = require("./lib/aws");

const args = process.argv;

const toBase64 = (filePath) => {
  const base64 = fs.readFileSync(filePath, "base64");
  const buffer = Buffer.from(base64, "base64");
  return buffer;
};

(async () => {
  try {
    const base64Data = toBase64(args[2]);
    console.log(await AWSClient.parseElement(base64Data));
  } catch (err) {
    console.error(err);
  }
})();
