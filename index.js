const Factory = require("./lib/factory/factory");
const VisionProvider = require("./lib/visionProvider");

const args = process.argv;

let maxLabels = args[3] || undefined;
let minConfidence = args[4] || undefined;
let label = args[5] || null;

(async () => {
  try {
    const Vision = VisionProvider.createClient({
      cloud: "AWS",
      region: "eu-central-1",
      profile: "default",
    });
    const base64Data = await Factory.encode(args[2], "base64");
    if (!maxLabels || !minConfidence || !label) {
      console.log(
        "No maxLabels or minConfidence or label provided, using default values"
      );
    }
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
