const errorTypes = require("../constants/error_types");
const errorhandler = (error, ctx) => {
  let status, message;
  switch (error.message) {
    case errorTypes.NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400;
      message = "账号或密码错误...";
      break;
    case errorTypes.NAME_IS_ALREADY_EXIST:
      status = 409;
      message = "用户名已存在...";
      break;
    case errorTypes.NAME_OR_PASSWORD_CAN_NOT_NULL:
      status = 400;
      message = "账号或密码不能为空...";
      break;
    case errorTypes.USER_IS_NOT_EXIST:
      status = 400;
      message = "用户不存在...";
      break;
    case errorTypes.PSW_IS_NOT_CORRECT:
      status = 400;
      message = "密码不正确，请再输入一次。";
      break;
    case errorTypes.UNAUTHORIZATIONED:
      status = 401;
      message = "无效的TOKEN...";
      break;
    case errorTypes.AUTHORIZATION_IS_NOT_EXIST:
      status = 401;
      message = "您未登录或者token无效（Authorization is not exist）...";
      break;
    case errorTypes.UNPERMISSION:
      status = 401;
      message = "您没有权限...";
      break;

    default:
      status = 404;
      message = "NOT FOUND";
  }
  //   console.log(error.message);
  ctx.status = status;
  ctx.body = message;
};
module.exports = errorhandler;
