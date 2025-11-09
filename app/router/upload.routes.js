const multer = require("multer");
const path = require("path");
const express = require("express");
const { uploadImage } = require("../http/controllers/upload.controller");
const { verifyAccessToken } = require("../http/middlewares/user.middleware");
const fs = require("fs");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "..", "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeFileName = file.originalname.replace(/\s+/g, "-");
    cb(null, Date.now() + "-" + safeFileName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("فرمت فایل باید jpg, jpeg یا png باشد"));
},
});

router.post("/", verifyAccessToken, upload.single("avatar"), uploadImage);

module.exports = {
  avatarRoutes: router,
};
