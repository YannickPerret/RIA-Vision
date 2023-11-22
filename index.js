const AWSClient = require("./lib/providers/aws");
const Factory = require("./lib/factory/factory");
const VisionClient = require("./lib/visionHandler");

const args = process.argv;
let maxLabels = undefined;
let minConfidence = undefined;
let label = undefined;

if (args[3] === "-label") {
  label = args[4];
}

if (args[4] === "-maxlabel") {
  maxLabels = args[5];
}

if (args[5] === "-confidence") {
  minConfidence = args[6];
}

(async () => {
  try {
    const Vision = new VisionClient("AWS");
    const base64Data = await Factory.encode(args[2], "base64");
    const data = await Vision.parseElement(
      base64Data,
      label,
      maxLabels,
      minConfidence
    );

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
