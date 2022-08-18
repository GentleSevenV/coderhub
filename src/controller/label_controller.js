const labelservice = require("../service/label_service");

class LabelController {
  async create(ctx, next) {
    const { labelname } = ctx.request.body;
    const result = await labelservice.create(labelname);
    ctx.body = result;
  }

  async list(ctx, next) {
    const { limit, offset } = ctx.query;
    const result = await labelservice.getLabels(limit, offset);
    ctx.body = result;
  }
}

module.exports = new LabelController();
