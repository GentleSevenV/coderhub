const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
dotenv.config();

// 相对路径写法：由于fs中相对路径是CWD，所以要查看项目启动路径（可从package.json文件查看到），本项目启动路径是在根目录下，所以相对路径要从src目录开始
// const PRIVATE_KEY = fs.readFileSync("src/app/key/private.key");
// const PUBLIC_KEY = fs.readFileSync("src/app/key/public.key");

// 绝对路径写法：拿到当前文件所在的文件目录和key文件所在的文件目录进行拼接
const PRIVATE_KEY = fs.readFileSync(
  path.resolve(__dirname, "./key/private.key")
);

const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, "./key/public.key"));

module.exports = {
  APP_HOST,
  APP_PORT,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
} = process.env;

// module.exports单独导出属性时，要放在module.exports导出对象之后，否则会导致之前导出的对象被替换从而失效
module.exports.PRIVATE_KEY = PRIVATE_KEY;
module.exports.PUBLIC_KEY = PUBLIC_KEY;
