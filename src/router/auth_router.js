const router = require("koa-router");
const authcontroller = require("../controller/auth_controller");
const { verifyLogin, verifyAuth } = require("../middleware/auth_middleware");
const authRouter = new router();
authRouter.post("/login", verifyLogin, authcontroller.login);
authRouter.get("/test", verifyAuth, authcontroller.success);
module.exports = authRouter;
