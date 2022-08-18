const fs = require("fs");
const fileservice = require("../service/file_service");
const momentservice = require("../service/moment_service");
const { PICTURE_PATH } = require("../constants/file_path");

class MomentController {
  async create(ctx, next) {
    const userid = ctx.user.id;
    const content = ctx.request.body.content;

    const result = await momentservice.create(content, userid);
    ctx.body = result;
  }

  async singledetail(ctx, next) {
    const { momentId } = ctx.params;
    const result = await momentservice.getSingleById(momentId);
    ctx.body = result;
  }

  async multidetail(ctx, next) {
    const { offset, size } = ctx.query;
    const result = await momentservice.getMultiList(offset, size);
    ctx.body = result;
  }

  async updateDetail(ctx, next) {
    const content = ctx.request.body.content;
    const { momentId } = ctx.params;
    const result = await momentservice.updateById(content, momentId);
    ctx.body = result;
  }

  async delcmt(ctx, next) {
    const { momentId } = ctx.params;
    const result = await momentservice.delById(momentId);
    ctx.body = result;
  }

  async addLabels(ctx, next) {
    const { labels } = ctx;
    const { momentId } = ctx.params;
    for (let label of labels) {
      const isLabelExist = await momentservice.hasLabel(momentId, label.id);
      if (!isLabelExist) {
        await momentservice.addLabel(momentId, label.id);
      }
    }
    ctx.body = "给动态添加标签成功！";
  }

  async fileInfo(ctx, next) {
    let { filename } = ctx.params;
    const fileInfo = await fileservice.getFileByName(filename);
    const { type } = ctx.query;
    const types = ["large", "middle", "small"];
    if (types.some((item) => item === type)) {
      filename = filename + "-" + type;
    }
    ctx.response.set("content-type", fileInfo.mimetype);
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
  }
}

module.exports = new MomentController();
