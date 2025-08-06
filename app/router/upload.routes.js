const multer = require("multer");
const path = require("path");
const express = require("express");
const { uploadImage } = require("../http/controllers/upload.controller");
const { verifyAccessToken } = require("../http/middlewares/user.middleware");
const fs = require("fs");

const router = express.Router();

const uploadDir = path.join(__dirname, "../../../bc/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../../bc/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/avatar", verifyAccessToken, upload.single("avatar"), uploadImage);

module.exports = router;
