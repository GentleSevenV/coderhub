const fs = require("fs");

const useRoutes = (app) => {
  // 读取当前目录下所有的文件，且遍历每一个文件
  fs.readdirSync(__dirname).forEach((file) => {
    // 跳过读取index.js入口文件
    if (file == "index.js") return;

    // 导入所有路由文件
    const router = require(`./${file}`);

    app.use(router.routes());
    app.use(router.allowedMethods());
  });
};

module.exports = useRoutes;
