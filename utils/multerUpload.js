import express from "express";
import multer from "multer";
const router = express.Router();

// const storage = multer.memoryStorage();
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.split("/")[0] === "image") {
//     cb(null, true);
//   } else {
//     cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
//   }
// };

// const multerUpload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 2000000, files: 1 },
// });
const storage = multer.memoryStorage();

// Create the multer instance
const multerUpload = multer({
  storage,
  limits: {
    fileSize: "1000000000000",
    fieldSize: 25 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.split("/")[0] === "image") {
      cb(null, true);
    } else {
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    }
  },
});

export default multerUpload;
