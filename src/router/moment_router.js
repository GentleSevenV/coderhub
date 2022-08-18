const router = require("koa-router");
const {
  verifyAuth,
  verifyPermission,
} = require("../middleware/auth_middleware");

const { verifyLabelExist } = require("../middleware/label_middleware");

const MomentController = require("../controller/moment_controller");

const momentRouter = new router({ prefix: "/moment" });

// 新增：根据登录的用户信息验证并发布动态
momentRouter.post("/", verifyAuth, MomentController.create);

// 查询：根据动态的id获取当前单条动态的信息
momentRouter.get("/:momentId", MomentController.singledetail);

// 查询：根据偏移量和需要查询的条数，获取多条动态信息以及各条动态下面的评论数量
momentRouter.get("/", MomentController.multidetail);

// 修改：根据动态的id，判断当前账号是否已经登录且是否有权限去修改这条动态，并且去修改这条动态
momentRouter.patch(
  "/:momentId",
  verifyAuth,
  verifyPermission,
  MomentController.updateDetail
);

// 删除：根据动态的id，判断当前账号是否已经登录且是否有权限去删除这条动态，并且去删除这条动态
momentRouter.delete(
  "/:momentId",
  verifyAuth,
  verifyPermission,
  MomentController.delcmt
);

momentRouter.post(
  "/:momentId/labels",
  verifyAuth,
  verifyPermission,
  verifyLabelExist,
  MomentController.addLabels
);

// 根据图片名称获取动态配图,并且使它能够在浏览器里直接展示的接口
momentRouter.get("/images/:filename", MomentController.fileInfo);

module.exports = momentRouter;
