const VisionClient = require("../lib/visionHandler");

describe("VisionClient", () => {
  describe("parseElement", () => {
    test("should call AWSClient.parseElement if cloud is AWS", async () => {
      // Arrange
      const awsClientMock = {
        parseElement: jest.fn().mockResolvedValue("AWS result"),
      };
      const visionClient = new VisionClient("AWS");

      // Act
      const result = await visionClient.parseElement(image);

      // Assert
      expect(awsClientMock.parseElement).toHaveBeenCalledWith(image);
      expect(result).toBe("AWS result");
    });

    test("should return an Error if cloud is invalid", async () => {
      // Arrange
      const image = "image.jpg";
      const label = "cat";
      const maxLabels = 5;
      const minConfidence = 80;
      const visionClient = new VisionClient("INVALID_CLOUD");

      // Act
      const result = await visionClient.parseElement(
        image,
        label,
        maxLabels,
        minConfidence
      );

      // Assert
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe("Invalid cloud provider");
    });
  });
});
