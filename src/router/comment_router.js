const Router = require("koa-router");
const {
  verifyAuth,
  verifyPermission,
} = require("../middleware/auth_middleware");
const commentcontroller = require("../controller/comment_controller");

const commentRouter = new Router({ prefix: "/comment" });

// 发布自己的评论
commentRouter.post("/", verifyAuth, commentcontroller.create);

// 评论其他人的评论
commentRouter.post("/:commentId/reply", verifyAuth, commentcontroller.reply);

// 单独接口获取评论列表
commentRouter.get("/:momentId", commentcontroller.getcmtlist);

// 修改自己的评论
commentRouter.patch(
  "/:commentId",
  verifyAuth,
  verifyPermission,
  commentcontroller.update
);

// 删除自己的评论
commentRouter.delete(
  "/:commentId",
  verifyAuth,
  verifyPermission,
  commentcontroller.remove
);

module.exports = commentRouter;
