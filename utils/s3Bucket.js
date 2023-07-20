// import AWS from "aws-sdk";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { v4 as uuidv4 } from "uuid";
// // const s3 = new AWS.S3({
// //   accessKeyId: ID,
// //   secretAccessKey: SECRET,
// // });
// export const s3Uploadv2 = async (file) => {
//   console.log(file.originalname);
//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `uploads/${uuidv4()}-${file.originalname}`,
//     Body: file.buffer,
//   };

//   return await s3.upload(params).promise();
// };

// export const s3Uploadv3 = async (files) => {
//   const s3client = new S3Client();

//   const params = files.map((file) => {
//     return {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: `uploads/${uuidv4()}-${file.originalname}`,
//       Body: file.buffer,
//     };
//   });

//   return await Promise.all(params.map((param) => s3client.send(new PutObjectCommand(param))));
// };

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export const s3Uploadv2 = async (file) => {
  console.log(file, 12);

  const s3client = new S3Client({
    region: process.env.region,
    credentials: {
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
    },
  });

  const params = {
    Bucket: process.env.bucketname,
    Key: `uploads/${uuidv4()}-${file.originalname}`,
    Body: file.buffer,
  };
  //   try {
  let data = await s3client.send(new PutObjectCommand(params));
  console.log(data);
  let fileLocation = `https://${process.env.bucketname}.s3.amazonaws.com/${params.Key}`;
  console.log(fileLocation);
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
