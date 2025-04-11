"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        if (mimeType && extname) {
            return cb(null, true);
        }
        cb(new Error("Only images are allowed"));
    }
});
exports.upload = upload;
/**
 *  try {
    const uploadedFiles = await Promise.all(
      req.files.map(async (file) => {
        const params = {
          Bucket: process.env.DIGITALOCEAN_SPACES_BUCKET,
          Key: `uploads/${Date.now()}_${file.originalname}`, // Unique filename
          Body: file.buffer,
          ACL: 'public-read', // Make file publicly accessible
          ContentType: file.mimetype,
        };

        const uploadResult = await s3.upload(params).promise();
        return { fileName: file.originalname, fileUrl: uploadResult.Location };
      })
    );

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

 */ 
