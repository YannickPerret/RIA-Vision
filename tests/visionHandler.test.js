const VisionProvider = require("../lib/visionProvider");
const Factory = require("../lib/factory/factory");

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
    const image = "./images/tests/invalid.jpg";
    const base64Data = await Factory.encode(image);

    await expect(Vision.parseElement(base64Data, 10, 60)).rejects.toThrow("Request has invalid image format");
  });

  it("should return data if the image is valid", async () => {
    const image = "./images/tests/valid.jpg";
    const base64Data = await Factory.encode(image);

    await expect(Vision.parseElement(base64Data, 10, 60)).resolves.toBeDefined();
  });
});


describe("getLabelsFromImage", () => {
  const Vision = VisionProvider.createClient({ cloud: "AWS", region: "eu-central-1", profile: "default" });
  
  it("should return the correct number of labels for a valid image", async () => {
    const image = "./images/tests/valid.jpg";
    const base64Data = await Factory.encode(image);

    const maxLabels = 15;
    const data = await Vision.parseElement(base64Data, maxLabels, 20);
    expect(data.Labels.length).toEqual(maxLabels);
  });

  it("should return the correct number of labels for a valid image URL", async () => {
    const imageUrl = "https://c0.lestechnophiles.com/www.numerama.com/wp-content/uploads/2022/09/wow-dragonflight-blizzard-1024x576.jpg?avif=1&key=3e271ace";
    const urlBase64 = await Factory.encode(imageUrl);
    const maxLabels = 10;
    const data = await Vision.parseElement(urlBase64, maxLabels, 20);
    expect(data.Labels.length).toEqual(maxLabels);
  });
});
