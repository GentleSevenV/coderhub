// 使用node.js中自带的一个库去加密明文密码
const crypto = require("crypto");

const md5password = (password) => {
  const md5 = crypto.createHash("md5");
  const result = md5.update(password).digest("hex");
  return result;
};

module.exports = md5password;
