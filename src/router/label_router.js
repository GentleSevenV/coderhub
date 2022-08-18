const router = require("koa-router");
const { verifyAuth } = require("../middleware/auth_middleware");
const labelcontroller = require("../controller/label_controller");

const labelRouter = new router({ prefix: "/label" });

// 创建标签接口
labelRouter.post("/", verifyAuth, labelcontroller.create);

// 获取标签列表接口
labelRouter.get("/", labelcontroller.list);
module.exports = labelRouter;
