const labelservice = require("../service/label_service");

const verifyLabelExist = async (ctx, next) => {
  // 从ctx.request.body中拿到所有客户端传入的labels值
  const { labels } = ctx.request.body;

  // 定义一个newLabels数组，用于存放每次for循环之后，产生的label对象
  const newLabels = [];

  // 将从labels拿到的name值进行一个遍历，执行下面的操作去数据库中查找数据库中是否已经存在每个name值
  for (let name of labels) {
    // 定义一个label对象，将每次执行for循环拿到的name先放入下面label的对象中
    const label = { name };

    // labelresult中存储的是每次for循环的时候执行getLabByName这个函数去数据库查询之后的返回值
    const labelresult = await labelservice.getLabByName(name);
    // console.log(labelresult);

    // 如果数据库中没有查到当前传入的name的名字（取反），则执行下面if代码，如果查到则执行else中的代码
    if (!labelresult) {
      // 如果没查到，则要在数据库中以当前的name创建一个新的
      const result = await labelservice.create(name);

      // 并且给上面label添加一个新的id属性,属性值等于创建之后返回值result中的insertId
      label.id = result.insertId;
    } else {
      // 如果在数据库中查到了当前传入的name，则也给当前label对象添加一个新的id属性，属性值等于查询到之后的返回值labelresult.insertId
      label.id = labelresult.id;
    }

    // 然后将每次拿到的label对象push到newLabels这个数组中
    newLabels.push(label);
  }

  console.log(newLabels);

  // 为了后面方便使用给ctx添加一个新的labels属性,将newLabels这个数组放入到ctx.labels这个对象中
  ctx.labels = newLabels;
  await next();
};

module.exports = { verifyLabelExist };
