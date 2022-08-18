const connection = require("../app/database");

class LabelService {
  async create(labelname) {
    const statement = `INSERT INTO label (name) VALUE (?);`;
    const result = await connection.execute(statement, [labelname]);
    return result[0];
  }

  async getLabByName(name) {
    const statement = `SELECT * FROM label WHERE name=?;`;

    // 先拿到返回值中result这个部分的数组
    const [result] = await connection.execute(statement, [name]);
    // 然后再拿到result这个数组中的值
    return result[0];
  }

  async getLabels(limit, offset) {
    const statement = `SELECT * FROM label LIMIT ?,?;`;
    const result = await connection.execute(statement, [offset, limit]);
    return result[0];
  }
}

module.exports = new LabelService();
