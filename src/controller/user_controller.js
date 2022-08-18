const fs = require("fs");
const { AVATAR_PATH } = require("../constants/file_path");

const service = require("../service/user_service");
const fileservice = require("../service/file_service");

// 定义一个类，然后在这个类中定义一个async函数方便调用
class UserController {
  async create(ctx, next) {
    // 处理接收客户端传递的数据
    const user = ctx.request.body;

    // 调用抽取出去的service类中的方法，处理返回给客户端的数据
    const result = await service.create(user);
    ctx.body = result;
  }

  // 根据用户id获取用户头像并展示图像
  async avatarInfo(ctx, next) {
    // 1.获取客户端传来的用户id
    const { userId } = ctx.params;

    // 2.根据用户id去数据库avatar表中查到用户头像的信息并返回
    const result = await fileservice.getAvatarById(userId);

    // 3.设置响应对象的文件类型（如果不设置，客户端拿到的只能是用户头像的对象字段信息，而不能真正展示头像图片）
    ctx.response.set("content-type", result.mimetype);

    // 4.根据文件路径及文件名，使用fs文件系统读取该路径下拿到的stream (AVATAR_PATH为定义的一个文件保存路径的常量，即：./uploads/avatar)
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${result.filename}`);
  }
}

module.exports = new UserController();
