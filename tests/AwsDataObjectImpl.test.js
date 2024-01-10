const AwsDataObjectImpl = require('../dataObject/libs/AwsDataObjectImpl');
const fs = require('fs');
require("dotenv").config();
const https = require('https');

const AWSBucket = new AwsDataObjectImpl(process.env.BUCKET_NAME, process.env.REGION, process.env.ACCESS_KEY_ID, process.env.SECRET_ACCESS_KEY);

beforeEach(async () => {
  // delete object test.jpg 
  await AWSBucket.deleteObject("test.jpg");
});


test('doesBucketExist', async () => {
  const bucketUri = process.env.BUCKET_NAME;
  expect(await AWSBucket.doesBucketExist(bucketUri)).toBe(true);
});

test('DoesExist_ExistingObject_ObjectExists', async () => {
  const localFile = "./images/valid.jpg";
  const objectUri = "test.jpg";
  const objectKey = await AWSBucket.uploadObject(localFile, objectUri);

  expect(await AWSBucket.doesObjectExist(objectKey.Key)).toBe(true);
});

test('DoesExist_MissingObject_ObjectNotExists', async () => {
  const objectUri = "test.jpg";
  expect(await AWSBucket.doesObjectExist(objectUri)).toBe(false);
})

test('Upload_BucketAndLocalFileAreAvailable_NewObjectCreatedOnBucket', async () => {
  const localFile = "./images/valid.jpg";

  const objectUri = "test.jpg";
  const bucketUri = process.env.BUCKET_NAME;

  expect(await AWSBucket.doesBucketExist(bucketUri)).toBe(true);
  expect(await AWSBucket.doesObjectExist(objectUri)).toBe(false);

  await AWSBucket.uploadObject(localFile, objectUri);

  expect(await AWSBucket.doesObjectExist(objectUri)).toBe(true);
});

test('Download_ObjectAndLocalPathAvailable_ObjectDownloaded', async () => {
  const localFile = "./images/valid.jpg";
  const localDist = './tests/download/test.jpg';
  const objectUri = "test.jpg";
  const objectKey = await AWSBucket.uploadObject(localFile, objectUri);
  console.log(objectKey.Key);

  expect(await AWSBucket.doesObjectExist(objectKey.Key)).toBe(true);
  expect(fs.existsSync(localFile)).toBe(false);

  await AWSBucket.downloadObject(objectUri, localDist);

  expect(fs.existsSync(localDist)).toBe(true);
});


test('Download_ObjectMissing_ThrowException', async () => {
  const localFile = "./images/validfd.jpg";
  const objectUri = "test.jpg";

  expect(await fs.existsSync(localFile)).toBe(false);

  expect(await AWSBucket.doesObjectExist(objectUri)).toBe(false);

  await expect(AWSBucket.downloadObject(objectUri)).rejects.toThrow("The specified key does not exist.");
});


test('Publish_ObjectExists_PublicUrlCreated', async () => {
  const localFile = "./images/valid.jpg";
  const objectUri = "test.jpg";
  const destinationFolder = "./download";
  const objectKey = await AWSBucket.uploadObject(localFile, objectUri);

  expect(await AWSBucket.doesObjectExist(objectKey.Key)).toBe(true);
  expect(fs.existsSync(destinationFolder)).toBe(true);

  const presignedUrl = await AWSBucket.publish(objectUri);

  //download file via https
  const file = fs.createWriteStream(destinationFolder + "/test.jpg");
  const request = https.get(presignedUrl, function (response) {
    response.pipe(file);
    file.on('finish', function () {
      file.close();
    });
  });

  expect(fs.existsSync(destinationFolder + "/test.jpg")).toBe(true);
});

test('Publish_ObjectMissing_ThrowException', async () => {
  const objectUri = "notvalidd.jpg";
  expect(await AWSBucket.doesObjectExist(objectUri)).toBe(false);

  await expect(AWSBucket.publish(objectUri)).rejects.toThrow("The specified key does not exist.");

});

test('Remove_ObjectPresentNoFolder_ObjectRemoved', async () => {
  const localFile = "./images/valid.jpg";
  const objectUri = "test.jpg";
  const objectKey = await AWSBucket.uploadObject(localFile, objectUri);

  expect(await AWSBucket.doesObjectExist(objectKey.Key)).toBe(true);

  await AWSBucket.deleteObject(objectUri);

  expect(await AWSBucket.doesObjectExist(objectKey.Key)).toBe(false);
});