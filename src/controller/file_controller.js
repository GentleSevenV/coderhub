const fileservice = require("../service/file_service");
const userservice = require("../service/user_service");
const { APP_HOST, APP_PORT } = require("../app/config");

class FileController {
  async saveAvatar(ctx, next) {
    //  注意：经过koa-multer处理之后，图片文件的信息是保存在ctx.req.file这个对象中的（此处可以打印一下ctx.req.file查看里面保存了哪些文件的相关信息）
    // console.log(ctx.req.file);

    // 除了获取到上传的文件相关信息外，上传的单个文件，存放在ctx.req.file中的
    const { filename, mimetype, size } = ctx.req.file;

    // 还要获取是谁上传了这个文件，也就是要获取当前登录的用户id
    const { id } = ctx.user;

    // 将图片相关信息保存到数据库的avatar表中
    const result = await fileservice.createAvatar(filename, mimetype, size, id);

    // 将图片的url保存到数据库的user表中
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;

    // 因为不需要保存头像到数据表中的返回值，所以直接await执行updateAvatarUrlById这个函数
    await userservice.updateAvatarUrlById(avatarUrl, id);
    ctx.body = "上传头像成功！";
  }

  async savePicture(ctx, next) {
    // 由于本次上传的是一个数组，所以文件是存放在ctx.req.files中不是ctx.req.file,要注意区分
    const files = ctx.req.files;
    const { id } = ctx.user;
    const { momentId } = ctx.query;

    for (let file of files) {
      const { filename, mimetype, size } = file;
      const result = await fileservice.createPicture(
        filename,
        mimetype,
        size,
        momentId,
        id
      );
    }

    ctx.body = "动态图片上传成功！";
  }
}

module.exports = new FileController();
