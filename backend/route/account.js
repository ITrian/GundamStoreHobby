const pool = require("../db");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Vui lòng nhập đầy đủ tài khoản và mật khẩu!" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM account WHERE username = $1",
      [username],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Tên đăng nhập không tồn tại!" });
    }

    const account = result.rows[0];

    if (!account.isactived) {
      return res.status(403).json({ error: "Tài khoản của bạn đã bị khóa!" });
    }


    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Mật khẩu không chính xác!" });
    }

    res.json({
      message: "Đăng nhập thành công!",
      userId: account.userid,
      username: account.username,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const logout = (req, res) => {
  res.json({ message: "Đăng xuất thành công!" });
};


const changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({ error: "Thiếu thông tin đổi mật khẩu!" });
  }

  try {
    
    const result = await pool.query(
      "SELECT password FROM account WHERE userid = $1",
      [userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy người dùng!" });
    }

    const currentHashedPass = result.rows[0].password;

   
    const isMatch = await bcrypt.compare(oldPassword, currentHashedPass);
    if (!isMatch) {
      return res.status(401).json({ error: "Mật khẩu cũ không đúng!" });
    }

    
    const salt = await bcrypt.genSalt(10);
    const newHashedPass = await bcrypt.hash(newPassword, salt);

    await pool.query("UPDATE account SET password = $1 WHERE userid = $2", [
      newHashedPass,
      userId,
    ]);

    res.json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login, logout, changePassword };
