const jwt = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../app/config.js");

class AuthController {
  async login(ctx, next) {
    console.log(ctx.user);
    // 用户信息验证通过之后，来到这里给当前用户通过私钥颁发对应的token

    // 通过之前给ctx中添加的user属性，拿到其中的id和name两个基本属性作为payload，然后通过私钥进行颁发token
    const { id, name } = ctx.user;
    const token = jwt.sign({ id, name }, PRIVATE_KEY, {
      // 设定当前token失效时间（单位：秒），当前设定的是24个小时
      expiresIn: 60 * 60 * 24,

      // 指定当前token的加密方式为RS256
      algorithm: "RS256",
    });

    // 给客户端返回id、name、token等相对应的信息
    ctx.body = {
      id,
      name,
      token,
    };
  }

  async success(ctx, next) {
    ctx.body = "token验证成功!";
  }
}

module.exports = new AuthController();
