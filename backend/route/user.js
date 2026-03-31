const pool = require("../db");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res) => {
  try {
    const query = `SELECT id, name, dateofbirth, email, address, isadmin FROM "user"`;
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const registerUser = async (req, res) => {
  const { name, dateOfBirth, email, address, username, password, isadmin } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ error: "Thông tin không hợp lệ!" });
  }

  const client = await pool.connect();
  try {
    const checkUser = await client.query(
      "SELECT username FROM account WHERE username = $1",
      [username],
    );
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: "Tên đăng nhập đã tồn tại!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    await client.query("BEGIN");

    const userSql = `INSERT INTO "user" (name, dateofbirth, email, address, isadmin) 
                     VALUES ($1, $2, $3, $4, $5) RETURNING id`;

    const userRes = await client.query(userSql, [
      name,
      dateOfBirth,
      email,
      address,
      isadmin !== undefined ? isadmin : false,
    ]);
    const newId = userRes.rows[0].id;

    const accSql = `INSERT INTO account (userid, username, password, isactived) 
                    VALUES ($1, $2, $3, true)`;
    await client.query(accSql, [newId, username, hashedPass]);

    await client.query("COMMIT");
    res.status(201).json({ message: "Đăng ký thành công!", userId: newId });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Lỗi đăng ký:", error.message);
    res.status(500).json({ error: "Có lỗi xảy ra, vui lòng thử lại." });
  } finally {
    client.release();
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, dateofbirth, email, address, isadmin } = req.body;
  try {
    const query = `UPDATE "user" SET name=$1, dateofbirth=$2, email=$3, address=$4, isadmin=$5 WHERE id=$6 RETURNING *`;
    const { rows } = await pool.query(query, [
      name,
      dateofbirth,
      email,
      address,
      isadmin !== undefined ? isadmin : false,
      id,
    ]);
    res.status(200).json({ message: "Cập nhật thành công", data: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Hàm cập nhật isadmin riêng (dành cho admin)
const updateUserAdmin = async (req, res) => {
  const { id } = req.params;
  const { isadmin } = req.body;
  
  if (isadmin === undefined) {
    return res.status(400).json({ error: "isadmin không được cung cấp" });
  }

  try {
    const query = `UPDATE "user" SET isadmin=$1 WHERE id=$2 RETURNING id, name, email, isadmin`;
    const { rows } = await pool.query(query, [isadmin, id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    res.status(200).json({ message: "Cập nhật quyền admin thành công", data: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getAllUsers,
  registerUser,
  updateUser,
  updateUserAdmin,
};
