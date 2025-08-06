const { UserModel } = require("../../models/user");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "هیچ فایلی ارسال نشده" });
    }
    const imageUrl = `uploads/${req.file.filename}`;
    const userId = req.user?._id;
    if (userId) {
      await UserModel.updateOne({ _id: req.user._id }, { $set: { avatar: imageUrl } });
    }
    res.json({ message: "آپلود عکس با موفقیت انجام شد", imageUrl });
  } catch (err) {
    res.status(500).json({ error: "خطا در سرور" });
  }
};

module.exports = {
  uploadImage,
};
