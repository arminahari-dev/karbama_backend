const Controller = require("./controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const { ProposalModel } = require("../../models/proposal");
const { addProposalSchema } = require("../validators/proposal.schema");
const { ProjectModel } = require("../../models/project");
const { copyObject } = require("../../../utils/functions");
const { ROLES } = require("../../../utils/constants");

class ProposalController extends Controller {
  async addNewProposal(req, res) {
    const userId = req.user._id;
    await addProposalSchema.validateAsync(req.body);
    const { description, price, duration, projectId } = req.body;

    const proposal = await ProposalModel.create({
      description,
      price,
      duration,
      user: userId,
      project: projectId,
    });
    await ProjectModel.updateOne(
      { _id: projectId },
      { $push: { proposals: proposal._id } }
    );
    if (!proposal?._id)
      throw createHttpError.InternalServerError("پیشنهاد ثبت نشد");

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "پیشنهاد با موفقیت ایجاد شد",
      },
    });
  }
  async getListOfProposals(req, res) {
    let dbQuery = {};
    const { sort } = req.query;

    const user = req.user;
    if (user.role !== ROLES.ADMIN) {
      dbQuery["user"] = user._id;
    }

    const sortQuery = {};

    if (!sort) sortQuery["createdAt"] = 1;
    if (sort) {
      if (sort === "latest") sortQuery["createdAt"] = -1;
      if (sort === "earliest") sortQuery["createdAt"] = 1;
    }

    const proposals = await ProposalModel.find(dbQuery)
      .populate("project")
      .sort(sortQuery);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        proposals,
      },
    });
  }
  async getProposalById(req, res) {
    const { id } = req.params;
    const proposal = await this.findProposalById(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        proposal,
      },
    });
  }
  async findProposalById(id) {
    if (!mongoose.isValidObjectId(id))
      throw createHttpError.BadRequest("شناسه پروژه ارسال شده صحیح نمیباشد");
    const proposal = await ProposalModel.findById(id);
    if (!proposal) throw createHttpError.NotFound("پروژه یافت نشد.");
    return proposal;
  }
  async changeProposalStatus(req, res) {
    const { id } = req.params;
    let { status } = req.body;
    if (isNaN(status)) {
      return res.status(400).json({
        statusCode: 400,
        message: "وضعیت باید عددی باشد",
      });
    }
    status = Number(status);

    const proposal = await ProposalModel.findOneAndUpdate(
      { _id: id },
      { $set: { status } } // 0, 1, 2
    );
    if (!proposal)
      throw createHttpError.InternalServerError(" وضعیت پروپوزال آپدیت نشد");

    const project = await ProjectModel.findOne({
      proposals: { $in: [proposal._id] },
    });

    let freelancer = copyObject(proposal).user;

    if (status !== 2) freelancer = null;

    await ProjectModel.updateOne(
      { _id: project._id },
      { $set: { freelancer } }
    );

    let message = "وضعیت پروپوزال تایید شد";
    if (status === 0) message = "وضعیت پروپوزال به حالت رد شده تغییر یافت";
    if (status === 1)
      message = "وضعیت پروپوزال به حالت در انتظار تایید تغییر یافت";

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    });
  }
  async updateProposal(req, res) {
    try {
      const userId = req.user._id;
      const { id } = req.params;
      const { description, price, duration } = req.body;

      if (!mongoose.isValidObjectId(id)) {
        throw createHttpError.BadRequest("شناسه پروپوزال معتبر نیست");
      }

      const proposal = await ProposalModel.findById(id);
      if (!proposal) {
        throw createHttpError.NotFound("پروپوزال یافت نشد");
      }

      if (proposal.user.toString() !== userId.toString()) {
        throw createHttpError.Forbidden(
          "شما اجازه ویرایش این پروپوزال را ندارید"
        );
      }

      const updatedProposal = await ProposalModel.findByIdAndUpdate(
        id,
        {
          $set: {
            ...(description && { description }),
            ...(price && { price }),
            ...(duration && { duration }),
          },
        },
        { new: true }
      );

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "پروپوزال با موفقیت بروزرسانی شد",
          updatedProposal,
        },
      });
    } catch (error) {
      console.error(error);
      throw createHttpError.InternalServerError("خطا در بروزرسانی پروپوزال");
    }
  }
  async getProposalsOfProject(req, res) {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError.BadRequest("شناسه پروژه معتبر نیست");
    }

    const project = await ProjectModel.findById(id)
      .populate({
        path: "proposals",
        populate: {
          path: "user",
          select: "name avatar",
        },
      })
      .lean();

    if (!project) {
      throw createHttpError.NotFound("پروژه یافت نشد");
    }

    project.proposals = project.proposals.map((proposal) => {
      if (proposal.user && proposal.user.avatar) {
        proposal.user.avatarUrl = `${process.env.SERVER_URL}/${proposal.user.avatar}`;
      } else {
        proposal.user.avatarUrl = null;
      }
      return proposal;
    });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        proposals: project.proposals,
      },
    });
  }
}

module.exports = {
  ProposalController: new ProposalController(),
};
