const AWS = require("aws-sdk");
const { Rekognition, SharedIniFileCredentials } = AWS;
const VisionClient = require("../VisionInterface");

class AWSClient extends VisionClient {
  constructor(region, profile) {
    super();

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

  async parseElement(image, label, maxLabels, minConfidence) {
    try {
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
      data.MaxLabels = maxLabels;
      data.MinConfidence = minConfidence;
      return data;
    } catch (err) {
      console.error("Erreur lors du traitement avec AWS Rekognition:", err);
      throw err;
    }
  }
}

module.exports = AWSClient;
