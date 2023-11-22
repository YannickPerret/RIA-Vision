const AWSClient = require("./lib/aws");
const Factory = require("./lib/factory/factory");

const args = process.argv;

(async () => {
  try {
    const base64Data = await Factory.encode(args[2], "base64");
    const data = await AWSClient.parseElement(base64Data);

    for (let i = 0; i < data.Labels.length; i++) {
      console.log(
        `Label : \x1b[33m${data.Labels[i].Name}\x1b[0m with confidence \x1b[33m${data.Labels[i].Confidence}\x1b[0m`
      );
    }
    console.log(`MaxLabels : ${data.MaxLabels}`);
    console.log(`MinConfidence : ${data.MinConfidence}`);
  } catch (err) {
    console.error(err);
  }
})();
