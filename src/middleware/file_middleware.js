const path = require("path");
const Jimp = require("jimp");
const multer = require("koa-multer");
const { AVATAR_PATH, PICTURE_PATH } = require("../constants/file_path");

// 上传的头像文件不带后缀名
const avatarUpload = multer({
  dest: AVATAR_PATH,
});

// 上传的头像文件带后缀名
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, AVATAR_PATH);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const avatarUpload = multer({
//   storage,
// });

const avatarHandler = avatarUpload.single("avatar");

const pictureUpload = multer({
  dest: PICTURE_PATH,
});

// 由于动态图片可能不止一张，所以用array这个方法,设置最多数量为9张图(注：这里的picture要和客户端body里的key值相同)
const pictureHandler = pictureUpload.array("picture", 9);

// 对上传的图像尺寸进行控制
const pictureResize = async (ctx, next) => {
  // 1.首先获取当前上传的所有图片
  const files = ctx.req.files;
  // 2.然后对每一张图片进行遍历
  for (let file of files) {
    // 3.利用nodejs中path.join对路径及文件名进行拼接，得到一个完整的路径
    const destpath = path.join(file.destination, file.filename);
    // 4.使用nodejs中的jimp库对上传的图片按照不同大小进行处理并写入到之前得到的完整路径中
    Jimp.read(file.path).then((image) => {
      image.resize(1280, Jimp.AUTO).write(`${destpath}-large`);
      image.resize(640, Jimp.AUTO).write(`${destpath}-middle`);
      image.resize(320, Jimp.AUTO).write(`${destpath}-small`);
    });
  }
  await next();
};

module.exports = { avatarHandler, pictureHandler, pictureResize };
