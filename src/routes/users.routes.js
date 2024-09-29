"use strict";

const { Router } = require("express");
const multer = require("multer");
const UserController = require("../controllers/UsersController");
const UserAvatarController = require("../controllers/UserAvatarController.js");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated.js");
const uploadConfig = require("../configs/upload.js");

const usersRoutes = Router();
const userController = new UserController();
const userAvatarController = new UserAvatarController();
const upload = multer(uploadConfig.MULTER);

usersRoutes.post("/", userController.create);
usersRoutes.put("/", ensureAuthenticated, userController.update);
// usersRoutes.patch(
//   "/avatar",
//   ensureAuthenticated,
//   upload.single("avatar"),
//   userAvatarController.update
// );

module.exports = usersRoutes;
