const LabelDetector = require("../lib/labelDetector");
const fs = require('fs');
require("dotenv").config();

const VisionDetector = LabelDetector.createClient({
  cloud: process.env.CLOUD_NAME,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// test Analyze_LocalFileWithDefaultValues_ImageAnalyzed given         Assert.IsTrue(File.Exists(localFile)));  when         Response response = await this.labelDetector.Analyze(localFile); then Assert.IsTrue(response.AmountOfLabels.Count() <= 10));foreach(Metric metric in response.Metrics){Assert.IsTrue(metric.confidenceLevel >= 90));}
test('Analyze_LocalFileWithDefaultValues_ImageAnalyzed', async () => {
  let localFile = "./images/valid.jpg";
  expect(fs.existsSync(localFile)).toBe(true);

  const response = await VisionDetector.analyze(localFile);
  expect(response.Labels.length <= 10).toBe(true);
  response.Labels.forEach(label => {
    expect(label.Confidence >= 90).toBe(true);
  });

})