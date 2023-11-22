const AWSClient = require("./lib/aws");
const Factory = require("./lib/factory/factory");

const args = process.argv;

(async () => {
  try {
    const base64Data = await Factory.encode(args[2], "base64");
    const data = await AWSClient.parseElement(base64Data);
    console.log(data);
  } catch (err) {
    console.error(err);
  }
})();
