const Factory = require("./lib/factory/factory");
const LabelDetector = require("./lib/labelDetector");
const { db, r } = require("./lib/database/database");
const AwsDataObjectImpl = require("./lib/bucket/AwsDataObjectImpl");
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();


const args = process.argv;

let maxLabels = Number(args[3]) || undefined;
let minConfidence = Number(args[4]) || undefined;

// create commande -?
if (args[2] === "--help") {
  console.log("\x1b[33mUsage: node index.js : <provider> <image> <maxLabels> <minConfidence>\x1b[0m");
  return;
}

(async () => {
  try {

    if(!args[2]) {
      console.error("\x1b[31mPlease provide an image\x1b[0m");
      return;
    }
    const bucket = new AwsDataObjectImpl(process.env.BUCKET_NAME, process.env.AWS_REGION, process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
    const Vision = LabelDetector.createClient({
      cloud: "AWS",
      region: "eu-central-1",
      profile: "default",
    });

    const imageEncode = await Factory.encode(args[2]);
    //upload image in s3
    const upload = await bucket.uploadObject(imageEncode, 'images/'+args[2]);
    const getImageAWS = await bucket.getImage(upload.Key)

    const image = await Factory.encode(getImageAWS);
    

    if (!maxLabels || !minConfidence) {
      throw new Error("No maxLabels or minConfidence or label provided, using default values");
    }
    const data = await Vision.analyze(image, maxLabels, minConfidence);

    if (data.Labels.length === 0) {
      return new Error("No labels found");
    }

    

    // insert in rethnikdb data
    await db.insert("image", data);

    // upload json in s3
    await bucket.uploadObject(JSON.stringify(data), uuidv4()+".json");

    for (let i = 0; i < data.Labels.length; i++) {
      console.log(`Label : \x1b[33m${data.Labels[i].Name}\x1b[0m with confidence \x1b[33m${data.Labels[i].Confidence}\x1b[0m`);
    }
    console.log(`MaxLabels : ${data.MaxLabels}`);
    console.log(`MinConfidence : ${data.MinConfidence}`);
  } catch (err) {
    console.error(err);
  }
})();
