const AWS = require("aws-sdk");
const AwsDataObjectImpl = require("../lib/bucket/AwsDataObjectImpl");
require("dotenv").config();
const { v4: uuidv4 } = require('uuid');

describe("AwsDataObjectImpl", () => {
  let awsDataObject;
  const fileContent = "file content";
  const objectUri = "valid.jpg";
  const missingObjectUri = uuidv4() + ".json";


  beforeEach(() => {
    awsDataObject = new AwsDataObjectImpl(process.env.BUCKET_NAME, process.env.AWS_REGION, process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);

  });

  describe("init", () => {
    it("should confirm that the existing bucket exists", async () => {
      const bucketExists = await awsDataObject.doesBucketExist();
      expect(bucketExists).toBeTruthy();
    });

    it("should confirm that the existing object exists", async () => {
      await awsDataObject.uploadObject(fileContent, objectUri);
      const objectExists = await AwsDataObjectImpl.doesObjectExist(awsDataObject.bucketName, objectUri);
      expect(objectExists).toBeTruthy();
    });

    it("should confirm that a missing object does not exist", async () => {
      const objectExists = await AwsDataObjectImpl.doesObjectExist(awsDataObject.bucketName, missingObjectUri);
      expect(objectExists).toBeFalsy();
    });

  });

  describe("uploadObject", () => {
    it("should create a new object in the bucket", async () => {
      const bucketExists = await awsDataObject.doesBucketExist();
      expect(bucketExists).toBeTruthy();

      const objectNotExists = await AwsDataObjectImpl.doesObjectExist(awsDataObject.bucketName, objectUri);
      expect(objectNotExists).toBeFalsy();

      await awsDataObject.uploadObject(fileContent, objectUri);
      const objectExistsNow = await AwsDataObjectImpl.doesObjectExist(awsDataObject.bucketName, objectUri);
      expect(objectExistsNow).toBeTruthy();
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

    it("should throw an error when trying to download a missing object", async () => {
      const objectExists = await AwsDataObjectImpl.doesObjectExist(awsDataObject.bucketName, missingObjectUri);
      expect(objectExists).toBeFalsy();

      await expect(awsDataObject.downloadObject(missingObjectUri)).rejects.toThrow();
    });
  });
});