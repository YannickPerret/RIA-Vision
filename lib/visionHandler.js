const AWSClient = require("./providers/aws");

class VisionClient {
  constructor(cloud, region = "eu-central-1", profile = "default") {
    this.cloud = String(cloud).toUpperCase();
    this.region = region;
    this.profile = profile;
  }

  async parseElement(image, label = null, maxLabels = 10, minConfidence = 60) {
    if (this.cloud === "AWS") {
      return await new AWSClient(this.profile, this.region).parseElement(
        image,
        label,
        maxLabels,
        minConfidence
      );
    } else if (this.cloud === "GOOGLE") {
      return await GoogleClient.parseElement(
        image,
        label,
        maxLabels,
        minConfidence
      );
    } else {
      return new Error("Invalid cloud provider");
    }
  }
}

module.exports = VisionClient;
