const commentservice = require("../service/comment_service");

class CommentController {
  async create(ctx, next) {
    const { momentId, content } = ctx.request.body;
    const { id } = ctx.user;
    const result = await commentservice.create(momentId, content, id);
    ctx.body = result;
  }

  // 根据动态的id，单独接口获取评论列表
  async getcmtlist(ctx, next) {
    const { momentId } = ctx.params;
    const result = await commentservice.getcmtlist(momentId);
    ctx.body = result;
  }

  async reply(ctx, next) {
    const { content, momentId } = ctx.request.body;
    const { commentId } = ctx.params;
    const { id } = ctx.user;
    const result = await commentservice.reply(content, momentId, id, commentId);
    ctx.body = result;
  }

  async update(ctx, next) {
    const { content } = ctx.request.body;
    const { commentId } = ctx.params;
    const result = await commentservice.update(content, commentId);
    ctx.body = result;
  }

  async remove(ctx, next) {
    const { commentId } = ctx.params;
    const result = await commentservice.remove(commentId);
    ctx.body = result;
  }
}

module.exports = new CommentController();
