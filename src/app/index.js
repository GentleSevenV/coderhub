const Koa = require("koa");
const bodyparser = require("koa-bodyparser");

// 将router抽取到router文件夹中的文件里,并且动态加载所有路由
const useRoutes = require("../router/index");
const errorhandler = require("./error_handler");

const app = new Koa();

// Koa-bodyparser这个中间件一定要在router中间件之前使用，否则无法解析body中的数据
app.use(bodyparser());

// 动态加载router文件夹下所有的路由
useRoutes(app);

app.on("error", errorhandler);

module.exports = app;
