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
    region: process.env.region,
    credentials: {
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
    },
  });
 

  const params = {
    Bucket: process.env.bucketname,
    Key: key ? key : `uploads/${uuidv4()}-${filename}`,
    Body: fileBuffer,
  };
  let data = await s3client.send(new PutObjectCommand(params));
  let fileLocation = `https://${process.env.bucketname}.s3.amazonaws.com/${params.Key}`;
  return fileLocation;
};

export const s3Uploadv3 = async (files) => {
  const s3client = new S3Client({
    region: "your-aws-region",
    credentials: {
      accessKeyId: "your-access-key-id",
      secretAccessKey: "your-secret-access-key",
    },
  });

  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uuidv4()}-${file.originalname}`,
      Body: file.buffer,
    };
  });

  return await Promise.all(params.map((param) => s3client.send(new PutObjectCommand(param))));
};
