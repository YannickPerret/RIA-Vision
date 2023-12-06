const AWS = require('aws-sdk');

class AWSS3Bucket {
  constructor(bucketName, region, accessKeyId, secretAccessKey) {
    this.bucketName = bucketName;
    this.s3 = new AWS.S3({
      region,
      accessKeyId,
      secretAccessKey
    });
  }

  async uploadFile(fileContent, fileName) {
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: fileContent
    };

    try {
      const data = await this.s3.upload(params).promise();
      console.log(`File uploaded successfully. ${data.Location}`);
      return data;
    } catch (err) {
      console.error("Error uploading file:", err);
      throw err;
    }
  }

  async downloadFile(fileName) {
    const params = {
      Bucket: this.bucketName,
      Key: fileName
    };

    try {
      const data = await this.s3.getObject(params).promise();
      console.log("File downloaded successfully");
      return data.Body;
    } catch (err) {
      console.error("Error downloading file:", err);
      throw err;
    }
  }
}

module.exports = AWSS3Bucket;
