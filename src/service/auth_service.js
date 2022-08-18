const connection = require("../app/database");

class AuthSerivce {
  async checkResource(tableName, resourceId, id) {
    const statement = `SELECT * FROM ${tableName} WHERE id=? AND user_id=?;`;
    const result = await connection.execute(statement, [resourceId, id]);
    return result[0].length === 0 ? false : true;
  }
}

module.exports = new AuthSerivce();
