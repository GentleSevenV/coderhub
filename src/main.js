const app = require("./app/index.js");
const config = require("./app/config.js");

require("./app/database");
app.listen(config.APP_PORT, () => {
  console.log(`coderhub服务器${config.APP_PORT}启动成功...`);
});
