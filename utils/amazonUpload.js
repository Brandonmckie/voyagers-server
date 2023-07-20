import { s3Uploadv2, s3Uploadv3 } from "../utils/s3Bucket.js";
export const mediaUpload = async (file) => {
  try {
    const results = await s3Uploadv2(file);
    console.log(results);
    return results;
  } catch (err) {
    // next(err);
  }
};
