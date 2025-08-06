const createHttpError = require("http-errors");
const { UserModel } = require("../../../models/user");
const Controller = require("../controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { ProjectModel } = require("../../../models/project");
const { ProposalModel } = require("../../../models/proposal");
const sendVerificationEmail = require("../../../../utils/sendVerificationEmail");

class UserController extends Controller {
  // ADMIN ROUTES :
  async getAllUsers(req, res) {
    let { page, limit } = req.query;
    page = page || 1;
    limit = limit || 20;
    const skip = (page - 1) * limit;
    const { search } = req.query;
    const searchTerm = new RegExp(search, "ig");
    // const databaseQuery = {};
    // if (search) databaseQuery["$text"] = { $search: search };
    const users = await UserModel.find({
      $or: [
        { name: searchTerm },
        { email: searchTerm },
        { phoneNumber: searchTerm },
      ],
    })
      .limit(limit)
      .skip(skip)
      .sort({
        createdAt: -1,
      });
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        users,
      },
    });
  }
  async userProfile(req, res) {
    const { userId } = req.params;
    const user = await UserModel.findById(userId, { otp: 0 });
    const createdProjects = await ProjectModel.find({ owner: userId });
    const completedProjects = await ProjectModel.find({ freelancer: userId });
    const proposals = await ProposalModel.find({ user: userId });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        user,
        createdProjects,
        completedProjects,
        proposals,
      },
    });
  }
  async verifyUser(req, res) {
    const { userId } = req.params;
    let { status } = req.body;
    status = Number(status);
    const updateResult = await UserModel.updateOne(
      { _id: userId },
      { $set: { status } }
    );

    const user = await UserModel.findById(userId);
    if (!user) throw createHttpError.NotFound("کاربر یافت نشد");

    if (updateResult.modifiedCount === 0)
      throw createHttpError.InternalServerError(" وضعیت کاربر آپدیت نشد");

    let message = "وضعیت کاربر تایید شد";
    if (status === 0) message = "وضعیت کاربر به حالت رد شده تغییر یافت";
    if (status === 1)
      message = "وضعیت کاربر به حالت در انتظار تایید تغییر یافت";

    if (status === 2) {
      message = "وضعیت کاربر تایید شد و ایمیل در حال ارسال است";
      await sendVerificationEmail({
        to: user.email,
        name: user.name,
        dashboardUrl: `${process.env.CLIENT_URL}`,
      }).catch((error) => {
        console.error("خطا در ارسال ایمیل:", error.message);
      });
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    });
  }
}

module.exports = {
  UserController: new UserController(),
};
