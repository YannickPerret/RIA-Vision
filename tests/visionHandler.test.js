const VisionClient = require("../lib/visionProvider");

describe("VisionClient", () => {
  describe("VisionProvider", () => {
    it("should return an error if the cloud provider is not valid", async () => {
      const Vision = new VisionClient({ cloud: "ll" });
      const image = "./assets/valid.jpg";
      const label = null;
      const maxLabels = 10;
      const minConfidence = 60;
      await expect(
        Vision.parseElement(image, label, maxLabels, minConfidence)
      ).rejects.toThrow("Invalid cloud provider");
    });
  });

  describe("getDataByImage", () => {
    it("should return an error if the image is not valid", async () => {
      const Vision = new VisionClient({ cloud: "AWS" });
      const image = "./assets/invalid.jpg";
      const label = null;
      const maxLabels = 10;
      const minConfidence = 60;
      await expect(
        Vision.parseElement(image, label, maxLabels, minConfidence)
      ).rejects.toThrow("Request has invalid image format");
    });

    it("should return an error if the image is not found", async () => {
      const Vision = new VisionClient({ cloud: "AWS" });
      const image = "./assets/notfound.jpg";
      const label = null;
      const maxLabels = 10;
      const minConfidence = 60;
      await expect(
        Vision.parseElement(image, label, maxLabels, minConfidence)
      ).rejects.toThrow(
        "InvalidImageFormatException: Request has invalid image format"
      );
    });

    it("should return data if the image is valid", async () => {
      const Vision = new VisionClient({ cloud: "AWS" });
      const image = "./assets/valid.jpg";
      const label = null;
      const maxLabels = 10;
      const minConfidence = 60;
      const data = await Vision.parseElement(
        image,
        label,
        maxLabels,
        minConfidence
      );
      expect(data).toBeDefined();
    });
  });

  describe("getDataByURL", () => {
    it("should return an error if the image url is not valid", async () => {
      const Vision = new VisionClient({ cloud: "AWS" });
      const image = "https://www.google.com";
      const label = null;
      const maxLabels = 10;
      const minConfidence = 60;
      await expect(
        Vision.parseElement(image, label, maxLabels, minConfidence)
      ).rejects.toThrow(
        "InvalidImageFormatException: Request has invalid image format"
      );
    });

    it("should return data if the image url is valid", async () => {
      const Vision = new VisionClient({ cloud: "AWS" });
      const image =
        "https://images.unsplash.com/photo-1562887107-2e7a9da7b1e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80";
      const label = null;
      const maxLabels = 10;
      const minConfidence = 60;
      const data = await Vision.parseElement(
        image,
        label,
        maxLabels,
        minConfidence
      );
      expect(data).toBeDefined();
    });
  });
});
