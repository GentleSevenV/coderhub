// 对数据库进行操作

const connection = require("../app/database");

// 抽取定义一个类，然后在这个类中定义一个async函数方便调用
class UserSeivice {
  async create(user) {
    const { name, password } = user;
    const statement = `INSERT INTO user (name,password) VALUE (?,?); `;
    const result = await connection.execute(statement, [name, password]);
    // console.log("已经将用户数据保存入数据库中", user);
    return result[0];
  }

  async getUserbyName(name) {
    const statement = `SELECT * FROM user WHERE name=?;`;
    const result = await connection.execute(statement, [name]);
    return result[0];
  }

  async updateAvatarUrlById(avatarUrl, userId) {
    const statement = `UPDATE user SET avatar_url=? WHERE id=?;`;
    const result = await connection.execute(statement, [avatarUrl, userId]);
    return result[0];
  }
}

module.exports = new UserSeivice();
