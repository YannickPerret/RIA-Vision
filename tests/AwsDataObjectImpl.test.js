const AWS = require("aws-sdk");
const AwsDataObjectImpl = require("../lib/bucket/AwsDataObjectImpl");
require("dotenv").config();
const { v4: uuidv4 } = require('uuid');

describe("AwsDataObjectImpl", () => {
  let awsDataObject;

  beforeEach(() => {
    awsDataObject = new AwsDataObjectImpl(process.env.BUCKET_NAME, process.env.AWS_REGION, process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("init", () => {
    it("should create a new S3 instance and check if the bucket exists", async () => {
      const mockHeadBucket = jest.spyOn(awsDataObject.s3, "headBucket").mockReturnValueOnce({
        promise: jest.fn().mockResolvedValueOnce()
      });

      await awsDataObject.init();

      expect(mockHeadBucket).toHaveBeenCalledWith({ Bucket: "my-bucket" });
      expect(console.log).toHaveBeenCalledWith("Bucket exists. my-bucket");
    });

    it("should create a new S3 instance and create the bucket if it does not exist", async () => {
      const mockHeadBucket = jest.spyOn(awsDataObject.s3, "headBucket").mockRejectedValueOnce({
        code: "NotFound"
      });
      const mockCreateBucket = jest.spyOn(awsDataObject.s3, "createBucket").mockReturnValueOnce({
        promise: jest.fn().mockResolvedValueOnce()
      });

      await awsDataObject.init();

      expect(mockHeadBucket).toHaveBeenCalledWith({ Bucket: "my-bucket" });
      expect(mockCreateBucket).toHaveBeenCalledWith({ Bucket: "my-bucket", ACL: "public-read" });
      expect(console.log).toHaveBeenCalledWith("Bucket created successfully. my-bucket");
    });
  });

  describe("uploadObject", () => {
    it("should upload the file to the bucket and return the data", async () => {
      const mockUpload = jest.spyOn(awsDataObject.s3, "upload").mockReturnValueOnce({
        promise: jest.fn().mockResolvedValueOnce({ Location: "https://my-bucket.s3.amazonaws.com/my-file.jpg" })
      });

      const fileContent = "file content";
      const fileName = "./images/tests/valid.jpg";
      const result = await awsDataObject.uploadObject(fileContent, fileName);

      expect(mockUpload).toHaveBeenCalledWith({
        Bucket: "my-bucket",
        Key: "my-file.jpg",
        Body: "file content"
      });
      expect(console.log).toHaveBeenCalledWith("File uploaded successfully. https://my-bucket.s3.amazonaws.com/my-file.jpg");
      expect(result).toEqual({ Location: "https://my-bucket.s3.amazonaws.com/my-file.jpg" });
    });

    it("should throw an error if an error occurs during file upload", async () => {
      const mockUpload = jest.spyOn(awsDataObject.s3, "upload").mockRejectedValueOnce(new Error("Upload error"));

      const fileContent = "file content";
      const fileName = "my-file.jpg";

      await expect(awsDataObject.uploadObject(fileContent, fileName)).rejects.toThrow("Upload error");

      expect(mockUpload).toHaveBeenCalledWith({
        Bucket: "my-bucket",
        Key: "my-file.jpg",
        Body: "file content"
      });
      expect(console.error).toHaveBeenCalledWith("Error uploading file:", expect.any(Error));
    });
  });

  describe("downloadObject", () => {
    it("should download the file from the bucket and return the file content", async () => {
      const mockGetObject = jest.spyOn(awsDataObject.s3, "getObject").mockReturnValueOnce({
        promise: jest.fn().mockResolvedValueOnce({ Body: "file content" })
      });

      const fileName = "my-file.jpg";
      const result = await awsDataObject.downloadObject(fileName);

      expect(mockGetObject).toHaveBeenCalledWith({
        Bucket: "my-bucket",
        Key: "my-file.jpg"
      });
      expect(console.log).toHaveBeenCalledWith("File downloaded successfully");
      expect(result).toEqual("file content");
    });

    it("should throw an error if an error occurs during file download", async () => {
      const mockGetObject = jest.spyOn(awsDataObject.s3, "getObject").mockRejectedValueOnce(new Error("Download error"));

      const fileName = "my-file.jpg";

      await expect(awsDataObject.downloadObject(fileName)).rejects.toThrow("Download error");

      expect(mockGetObject).toHaveBeenCalledWith({
        Bucket: "my-bucket",
        Key: "my-file.jpg"
      });
      expect(console.error).toHaveBeenCalledWith("Error downloading file:", expect.any(Error));
    });
  });
});