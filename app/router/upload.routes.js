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
const upload = multer({ storage });

router.post("/avatar", verifyAccessToken, upload.single("avatar"), uploadImage);

module.exports = router;
