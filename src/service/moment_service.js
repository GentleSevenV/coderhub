const connection = require("../app/database");

class MomentService {
  async create(content, userid) {
    const statement = `INSERT INTO moment(content,user_id) VALUE (?,?);`;
    const result = await connection.execute(statement, [content, userid]);
    return result[0];
  }

  // 根据动态的id只获取当前动态的信息
  // async getSingleById(momentId) {
  //   const statement = `
  //     SELECT m.id id,m.content content, m.createAt createTime,m.updateAt updateTime,
  //       JSON_OBJECT('id',u.id,'name',u.name) user
  //     FROM moment m
  //     LEFT JOIN user u ON m.user_id=u.id
  //     WHERE m.id=?;`;
  //   const result = await connection.execute(statement, [momentId]);
  //   return result[0];
  // }

  // 根据动态的id获取当前动态的信息以及所属当前动态的评论
  async getSingleById(momentId) {
    const statement = `
    SELECT m.id id,m.content content, m.createAt createTime,m.updateAt updateTime,
      JSON_OBJECT('id',u.id,'name',u.name,'avatarUrl',u.avatar_url) user ,
      IF(COUNT(l.id),JSON_ARRAYAGG(JSON_OBJECT("id",l.id,"name",l.name)),NULL) labels,
      (SELECT IF(COUNT(c.id),JSON_ARRAYAGG(JSON_OBJECT("id",c.id,"content",c.content,"commentId",c.comment_id,"createTime",c.createAt,"user",JSON_OBJECT("id",cu.id,"name",cu.name,'avatarUrl',cu.avatar_url))),NULL) FROM comment c LEFT JOIN user cu ON c.user_id=cu.id WHERE m.id=c.moment_id) comments,
	    (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/', file.filename)) 
	    FROM file WHERE m.id = file.moment_id) images
    FROM moment m
    LEFT JOIN user u ON m.user_id=u.id
    LEFT JOIN moment_label ml ON m.id=ml.moment_id
    LEFT JOIN label l ON ml.label_id=l.id
    WHERE m.id=?
    GROUP BY m.id;`;
    const result = await connection.execute(statement, [momentId]);
    return result[0];
  }

  async getMultiList(offset, size) {
    const statement = `
      SELECT m.id id,m.content content, m.createAt createTime,m.updateAt updateTime,
        JSON_OBJECT('id',u.id,'name',u.name) user ,
        (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id ) commentCount,
        (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount
      FROM moment m 
      LEFT JOIN user u ON m.user_id=u.id 
      LIMIT?,?;`;
    const result = await connection.execute(statement, [offset, size]);
    return result[0];
  }

  async updateById(content, momentId) {
    const statement = `UPDATE moment SET content=? WHERE id=?;`;
    const result = await connection.execute(statement, [content, momentId]);
    return result[0];
  }

  async delById(momentId) {
    const statement = `DELETE FROM moment WHERE id = ?;`;
    const result = await connection.execute(statement, [momentId]);
    return result[0];
  }

  async hasLabel(momentId, label_id) {
    const statement = `SELECT * FROM moment_label WHERE moment_id=? AND label_id=?;`;
    const [result] = await connection.execute(statement, [momentId, label_id]);
    return result[0] ? true : false;
  }

  async addLabel(momentId, label_id) {
    const statement = `INSERT INTO moment_label (moment_id,label_id) VALUES (?,?);`;
    const result = await connection.execute(statement, [momentId, label_id]);
    return result[0];
  }
}

module.exports = new MomentService();
