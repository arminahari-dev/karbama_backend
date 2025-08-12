const multer = require("multer");
const path = require("path");
const express = require("express");
const { uploadResume } = require("../http/controllers/resume.controller");
const { verifyAccessToken } = require("../http/middlewares/user.middleware");
const fs = require("fs");

const router = express.Router();

const resumeUploadDir = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "uploads",
  "resumes"
);

if (!fs.existsSync(resumeUploadDir)) {
  fs.mkdirSync(resumeUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeUploadDir);
  },
  filename: (req, file, cb) => {
    const safeFileName = file.originalname.replace(/\s+/g, "-");
    cb(null, Date.now() + "-" + safeFileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("فقط فایل PDF یا DOCX مجاز است"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

router.post(
  "/",
  verifyAccessToken,
  upload.single("resume"),
  uploadResume
);

module.exports = {
  resumeRoutes: router,
};
