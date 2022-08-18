const jwt = require("jsonwebtoken");
const errorTypes = require("../constants/error_types");
const service = require("../service/user_service");
const authservice = require("../service/auth_service");
const md5password = require("../utils/md5_password");
const { PUBLIC_KEY } = require("../app/config");

const verifyLogin = async (ctx, next) => {
  const { name, password } = ctx.request.body;

  // 首先判断用户名和密码是否为空
  if (!name || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_CAN_NOT_NULL);
    return ctx.app.emit("error", error, ctx);
  }

  // 判断用户名是否存在
  const result = await service.getUserbyName(name);
  const user = result[0];
  if (!user) {
    const error = new Error(errorTypes.USER_IS_NOT_EXIST);
    return ctx.app.emit("error", error, ctx);
  }

  // 最后将客户端传过来的用户名和密码同数据库中进行校验（在校验前要对传过来的密码进行加密，然后再进行校验）
  if (md5password(password) !== user.password) {
    console.log(md5password(password));
    const error = new Error(errorTypes.PSW_IS_NOT_CORRECT);
    return ctx.app.emit("error", error, ctx);
  }

  // 给ctx添加一个user属性，用于存储验证通过之后的正确用户信息，方便后续颁发token使用
  ctx.user = user;

  await next();
};

const verifyAuth = async (ctx, next) => {
  // 获取ctx.header中authorization的值（authorization中保存了token这一数据）
  const authorization = ctx.header.authorization;

  // 判断如果用户在未登录直接访问某些资源或者authorization不存在的情况
  if (!authorization) {
    const error = new Error(errorTypes.AUTHORIZATION_IS_NOT_EXIST);
    return ctx.app.emit("error", error, ctx);
  }

  // 由于token存在authorization中，所以要使用空字符串替换掉值中“Bearer ”这一部分，剩下的就是我们所需要验证的token
  const token = authorization.replace("Bearer ", "");

  // 使用js中try...catch..语法，去测试token能否通过验证，如果不通过则返回错误信息。
  try {
    // 使用jwt对上面拿到的token通过公钥进行验证，并指定加密方式为RS256
    // result就是jwt验证之后返回的是一个之前token中携带的用户数据对象，包括{id,name,iat,exp..}
    const result = jwt.verify(token, PUBLIC_KEY, {
      // algorithms字段中保存的是一个加密方式的数组，意思是通过一种加密方式验证不通过之后，可以使用其他的加密方式继续验证
      algorithms: ["RS256"],
    });
    // console.log(result);
    // 为了后期方便使用，将验证通过之后的用户信息再次保存到ctx.user这一属性中
    ctx.user = result;
    await next();
  } catch (err) {
    const error = new Error(errorTypes.UNAUTHORIZATIONED);
    return ctx.app.emit("error", error, ctx);
  }
};

// 当我们需要验证对某些操作的权限时（比如修改评论只能去修改自己的，而不能去修改他人的，那么首先我们得验证当前登录的账号和所需要修改的评论是否匹配，如果这条评论是自己的才能去修改，否则就没有权限去修改）
const verifyPermission = async (ctx, next) => {
  // 首先得获取当前操作需要的数据表信息（这里的数据库表命名必须符合SQL风格（比如commentId必须是在comment这张表的主键），否则下面的方法不适用）

  // 比如commentId是存在于comment这张表里，而commentId又是存在于ctx.params中，那么如果我们获取comment这张表的名称时，只需要先获取commentId这一字段，然后截取掉后面Id，剩下的就是表的名称
  const [resourceKey] = Object.keys(ctx.params);
  const tableName = resourceKey.replace("Id", "");

  // 然后根据commentId获取commentId的值
  const resourceId = ctx.params[resourceKey];

  const { id } = ctx.user;
  const isPermission = await authservice.checkResource(
    tableName,
    resourceId,
    id
  );
  if (!isPermission) {
    const error = new Error(errorTypes.UNPERMISSION);
    return ctx.app.emit("error", error, ctx);
  }

  await next();
};

module.exports = { verifyLogin, verifyAuth, verifyPermission };
