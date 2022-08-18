const connection = require("../app/database");

class CommentService {
  async create(momentId, content, id) {
    const statement = `INSERT INTO comment (content,moment_id,user_id) VALUES (?,?,?);`;
    const result = await connection.execute(statement, [content, momentId, id]);
    return result[0];
  }

  // 根据动态的id，单独接口获取评论列表
  async getcmtlist(momentId) {
    const statement = `
    SELECT
      c.id,c.content,c.comment_id commentId,c.createAt createTime,
      JSON_OBJECT( "id", u.id, "name", u.name ) user
    FROM comment c
    LEFT JOIN user u ON u.id=c.user_id
    WHERE moment_id=8;`;
    const result = await connection.execute(statement, [momentId]);
    return result[0];
  }

  async reply(content, momentId, id, commentId) {
    const statement = `INSERT INTO comment (content,moment_id,user_id,comment_id) VALUES (?,?,?,?);`;
    const result = await connection.execute(statement, [
      content,
      momentId,
      id,
      commentId,
    ]);
    return result[0];
  }

  async update(content, commentId) {
    const statement = `UPDATE comment SET content=? WHERE id=?;`;
    const result = await connection.execute(statement, [content, commentId]);
    return result[0];
  }

  async remove(commenId) {
    const statement = `DELETE FROM comment WHERE id=?;`;
    const result = await connection.execute(statement, [commenId]);
    return result[0];
  }
}

module.exports = new CommentService();
