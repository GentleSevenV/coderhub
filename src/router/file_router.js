const router = require("koa-router");
const {
  avatarHandler,
  pictureHandler,
  pictureResize,
} = require("../middleware/file_middleware");
const { verifyAuth } = require("../middleware/auth_middleware");
const filecontroller = require("../controller/file_controller");

const fileRouter = new router({ prefix: "/upload" });

// 上传头像接口
fileRouter.post(
  "/avatar",
  verifyAuth,
  avatarHandler,
  filecontroller.saveAvatar
);

// 动态moment配图上传接口
fileRouter.post(
  "/picture",
  verifyAuth,
  pictureHandler,
  pictureResize,
  filecontroller.savePicture
);

module.exports = fileRouter;
