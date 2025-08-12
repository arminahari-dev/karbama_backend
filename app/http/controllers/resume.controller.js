const { UserModel } = require("../../models/user");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "هیچ فایلی ارسال نشده" });
    }

    const resumeUrl = `uploads/resumes/${req.file.filename}`;
    const userId = req.user?._id;

    if (userId) {
      await UserModel.updateOne(
        { _id: req.user._id },
        { $set: { resume: resumeUrl } }
      );
    }

    res.json({
      message: "رزومه با موفقیت آپلود شد",
      resumeUrl,
    });
  } catch (err) {
    res.status(500).json({ error: "خطا در سرور" });
  }
};

module.exports = {
  uploadResume,
};
