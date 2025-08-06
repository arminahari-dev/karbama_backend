const { UserModel } = require("../../models/user");

const updateUserBiography = async (req, res) => {
  try {
    const userId = req.user.id;
    const { biography } = req.body;

    if (!biography || typeof biography !== "string") {
      return res.status(400).json({ message: "بیوگرافی معتبر نیست" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { biography },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      biography: updatedUser.biography,
      message: "بیوگرافی با موفقیت ویرایش شد",
    });
  } catch (error) {
    return res.status(500).json({ message: "خطای سرور." });
  }
};

const updatePhoneNumber = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { phoneNumber } = req.body;

    if (!phoneNumber || typeof phoneNumber !== "string") {
      return res.status(400).json({ message: "شماره تلفن معتبر نیست" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { phoneNumber },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      phoneNumber: updatedUser.phoneNumber,
      message: "شماره تلفن با موفقیت به‌روزرسانی شد.",
    });
  } catch (error) {
    res.status(500).json({ message: "خطا در به‌روزرسانی شماره تلفن" });
  }
};

const updateEmail = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "ایمیل معتبر نیست" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { email },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      email: updatedUser.email,
      message: "ایمیل با موفقیت به‌روزرسانی شد.",
    });
  } catch (error) {
    res.status(500).json({ message: "خطا در به‌روزرسانی ایمیل" });
  }
};

module.exports = {
  updateUserBiography,
  updatePhoneNumber,
  updateEmail,
};
