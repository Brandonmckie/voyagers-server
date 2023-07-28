import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export const s3Uploadv2 = async (file, key) => {
  let filename;
  let fileBuffer;
  if (file?.originalname) {
    filename = file?.originalname;
    fileBuffer = file?.buffer;
  } else {
    filename = file[0]?.originalname;
    fileBuffer = file[0]?.buffer;
  }

  const s3client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESSKEYID,
      secretAccessKey: process.env.S3_SECRETACCESSKEY,
    },
  });

  const params = {
    Bucket: process.env.S3_BUCKETNAME,
    Key: key ? key : `uploads/${uuidv4()}-${filename}`,
    Body: fileBuffer,
  };
  let data = await s3client.send(new PutObjectCommand(params));
  let fileLocation = `https://${process.env.S3_BUCKETNAME}.s3.amazonaws.com/${params.Key}`;
  return fileLocation;
};

export const s3Uploadv3 = async (files) => {
  const s3client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESSKEYID,
      secretAccessKey: process.env.S3_SECRETACCESSKEY,
    },
  });

  const params = files.map((file) => {
    return {
      Bucket: process.env.S3_BUCKETNAME,
      Key: file.key,
      Body: file.file.buffer,
    };
  });

  return await Promise.all(params.map((param) => s3client.send(new PutObjectCommand(param))));
};
