const AWS = require("aws-sdk");
const { Rekognition, SharedIniFileCredentials } = AWS;

class AWSClient {
  constructor(profile = "default", region = "eu-central-1") {
    this.profile = profile;
    this.region = region;
    this.credentials = null;

    this.init();
  }

  init() {
    this.credentials = new SharedIniFileCredentials({ profile: this.profile });
    AWS.config.credentials = this.credentials;
    AWS.config.update({ region: this.region });
  }

  async parseElement(image, label = null, maxLabels = 10, minConfidence = 60) {
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

module.exports = new AWSClient();
