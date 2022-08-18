const router = require("koa-router");
const userRouter = new router({ prefix: "/users" });

const { verifyUser, handlePassword } = require("../middleware/user_middleware");

// 将router中的处理函数抽取到controller文件中进行调用
const controller = require("../controller/user_controller");

// 调用controller文件中处理函数
// 在调用controller函数之前，要对客户端拿到的name和psw进行验证，所以要加一个验证的自定义中间件verifyUser
userRouter.post("/", verifyUser, handlePassword, controller.create);

// 获取用户头像接口
userRouter.get("/:userId/avatar", controller.avatarInfo);

module.exports = userRouter;
