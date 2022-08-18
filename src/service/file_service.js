const connection = require("../app/database");

class FileService {
  async createAvatar(filename, mimetype, size, userid) {
    const statement = `INSERT INTO avatar(filename,mimetype,size,user_id) VALUES (?,?,?,?);`;
    const result = await connection.execute(statement, [
      filename,
      mimetype,
      size,
      userid,
    ]);

    return result[0];
  }

  async getAvatarById(userId) {
    const statement = `SELECT * FROM avatar WHERE user_id=?;`;
    const [result] = await connection.execute(statement, [userId]);

    // 注意：由于我们根据id上传头像时在数据库中都是新增一条，而不是更新之前的那一条数据，也就意味着同一个用户id会有多条头像数据，所以为了拿到最新的头像数据，则需要返回最后（最新）的那一条数据result[result.length - 1]，而不是第一条result[0]
    return result[result.length - 1];
  }

  async createPicture(filename, mimetype, size, momentId, userId) {
    const statement = `INSERT INTO file(filename,mimetype,size,moment_id,user_id) VALUES (?,?,?,?,?);`;
    const [result] = await connection.execute(statement, [
      filename,
      mimetype,
      size,
      momentId,
      userId,
    ]);
    return result;
  }

  async getFileByName(filename) {
    const statement = `SELECT * FROM file WHERE filename=?;`;
    const [result] = await connection.execute(statement, [filename]);
    return result[0];
  }
}

module.exports = new FileService();
