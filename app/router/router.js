const { ROLES } = require("../../utils/constants");
const { authorize } = require("../http/middlewares/permission.guard");
const {
  verifyAccessToken,
  isVerifiedUser,
} = require("../http/middlewares/user.middleware");
const { adminRoutes } = require("./admin/admin.routes");
const { categoryRoutes } = require("./category");
const { projectRoutes } = require("./project");
const { proposalRoutes } = require("./proposal");
const { userAuthRoutes } = require("./userAuth");
const {avatarRoutes} = require("./upload.routes");
const { UserRoutes } = require("./user.routes");
const { resumeRoutes } = require("./resume.routes");

const router = require("express").Router();

router.use("/user", userAuthRoutes);
router.use("/category", categoryRoutes);
router.use(
  "/project",
  verifyAccessToken,
  isVerifiedUser,
  // authorize(ROLES.ADMIN, ROLES.OWNER),
  projectRoutes
);
router.use("/proposal", verifyAccessToken, isVerifiedUser, proposalRoutes);
router.use(
  "/admin",
  verifyAccessToken,
  isVerifiedUser,
  authorize(ROLES.ADMIN),
  adminRoutes
);
router.use("/upload/avatar", avatarRoutes);
router.use("/user", UserRoutes);
router.use("/upload/resume", resumeRoutes);

module.exports = {
  allRoutes: router,
};
