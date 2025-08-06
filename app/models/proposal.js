const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ProposalSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    description: { type: String, required: true },
    user: { type: ObjectId, ref: "User", required: true },
    status: {
      type: Number,
      required: true,
      default: 1,
      enum: [0, 1, 2],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  ProposalModel: mongoose.model("Proposal", ProposalSchema),
};
