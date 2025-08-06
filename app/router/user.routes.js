const express = require("express");
const {
  updateUserBiography,
  updatePhoneNumber,
  updateEmail,
} = require("../http/controllers/user.controller");
const { verifyAccessToken } = require("../http/middlewares/user.middleware");

const router = express.Router();

router.patch("/biography", verifyAccessToken, updateUserBiography);
router.patch("/phone-number", verifyAccessToken, updatePhoneNumber);
router.patch("/email", verifyAccessToken, updateEmail);

module.exports = {
  UserRoutes: router,
};
