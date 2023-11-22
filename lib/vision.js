const AWS = require("aws-sdk");
const { Rekognition } = AWS;

export class VisionAPI {
  constructor() {}

  async parseImage(image, label = null, maxLabels = 10, minConfidence = 60) {
    const params = {
      Image: {
        Bytes: image,
      },
      MaxLabels: maxLabels,
      MinConfidence: minConfidence,
      label: label,
    };

    const visionClient = new Rekognition();
    const data = await visionClient.detectLabels(params).promise();
    return data;
  }
}
