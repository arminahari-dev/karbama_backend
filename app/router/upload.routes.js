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
});

router.post("/", verifyAccessToken, (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "حجم فایل بیش از حد مجاز است" });
      }
      return res.status(400).json({ error: err.message });
    }
    uploadImage(req, res);
  });
});

module.exports = {
  avatarRoutes: router,
};
