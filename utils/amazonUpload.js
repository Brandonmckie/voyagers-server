import { s3Uploadv2, s3Uploadv3 } from "../utils/s3Bucket.js";
export const mediaUpload = async (file,key) => {
  try {
    const results = await s3Uploadv2(file,key);
  
    return results;
  } catch (err) {
    // next(err);
  }
};
