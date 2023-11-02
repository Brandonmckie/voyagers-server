import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

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

  // const width = 262; // New width
  // const height = 234; // New height

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
    // Body: await resizedImageBuffer(fileBuffer, width, height),
    Body: fileBuffer,
  };
  let data = await s3client.send(new PutObjectCommand(params));
  let fileLocation = `https://${process.env.S3_BUCKETNAME}.s3.amazonaws.com/${params.Key}`;
  return fileLocation;
};

const resizedImageBuffer = async (file, width, height) => {
  return await sharp(file).resize(width, height).toBuffer();
};

export const s3Uploadv3 = async (files) => {
  try {
    const s3client = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESSKEYID,
        secretAccessKey: process.env.S3_SECRETACCESSKEY,
      },
    });

    // const width = 270; // New width
    // const height = 220; // New height

    // Resize the image using sharp

    const params = await Promise.all(
      files.map(async (file) => {
        // const resizedBuffer = await resizedImageBuffer(file.file.buffer, width, height);
        return {
          Bucket: process.env.S3_BUCKETNAME,
          Key: file.key,
          Body: file.file.buffer,
        };
      })
    );
    console.log(params);

    return await Promise.all(params.map((param) => s3client.send(new PutObjectCommand(param))));
  } catch (error) {
    console.log(error);
  }
};
