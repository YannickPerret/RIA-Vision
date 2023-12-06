const VisionProvider = require("../lib/visionProvider");

describe("VisionProvider", () => {
  it("should correctly initialize with AWS", () => {
    expect(() => {
      VisionProvider.createClient({ cloud: "AWS", region: "eu-central-1", profile: "default" });
    }).not.toThrow();
  });

  it("should throw an error if the cloud provider is not valid", () => {
    expect(() => {
      VisionProvider.createClient({ cloud: "InvalidProvider", region: "eu-central-1", profile: "default" });
    }).toThrow("Invalid cloud provider");
  });
});

describe("getDataByImage", () => {
  const Vision = VisionProvider.createClient({ cloud: "AWS", region: "eu-central-1", profile: "default" });

  it("should return an error if the image is not valid", async () => {
    const image = "./assets/invalid.jpg";
    await expect(Vision.parseElement(image, 10, 60)).rejects.toThrow("Request has invalid image format");
  });

  it("should return data if the image is valid", async () => {
    const image = "./assets/valid.jpg";
    await expect(Vision.parseElement(image, 10, 60)).resolves.toBeDefined();
  });
});


describe("getLabelsFromImage", () => {
  const Vision = VisionProvider.createClient({ cloud: "AWS", region: "eu-central-1", profile: "default" });
  
  it("should return the correct number of labels for a valid image", async () => {
    const image = "./assets/valid.jpg";
    const maxLabels = 15;
    const data = await Vision.parseElement(image, maxLabels, 60);
    expect(data.Labels.length).toEqual(maxLabels);
  });

  it("should return the correct number of labels for a valid image URL", async () => {
    const imageUrl = "https://fastly.picsum.photos/id/291/200/300.jpg?hmac=5htP1HYHWPOMv5wbTtTsh6GjRk__SPxuXIv6gHLBHHg";
    const maxLabels = 10;
    const data = await Vision.parseElement(imageUrl, maxLabels, 60);
    expect(data.Labels.length).toEqual(maxLabels);
  });
});
