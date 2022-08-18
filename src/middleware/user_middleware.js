const errorTypes = require("../constants/error_types");
const service = require("../service/user_service");
const md5password = require("../utils/md5_password");

const verifyUser = async (ctx, next) => {
  // 获取用户名和密码
  const { name, password } = ctx.request.body;

  // 判断用户名和密码是否为空
  if (!name || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
    console.log("用户名或密码不能为空...");
    return ctx.app.emit("error", error, ctx);
  }

  // 判断这次注册的用户名是否已经存在
  const result = await service.getUserbyName(name);
  console.log(result);
  if (result.length) {
    const error = new Error(errorTypes.NAME_IS_ALREADY_EXIST);
    console.log("用户名已经存在！");
    return ctx.app.emit("error", error, ctx);
  }
  await next();
};

// 定义一个方法用于加密用户传过来的明文密码
const handlePassword = async (ctx, next) => {
  const { password } = ctx.request.body;
  ctx.request.body.password = md5password(password);

  await next();
};

module.exports = { verifyUser, handlePassword };
