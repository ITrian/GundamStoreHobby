const express = require("express");
const pool = require("./db");



const app = express();
const cors = require("cors");

app.use(cors()); 
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  const text = `
    Backend đang hoạt động
    [1] GET /users: lấy danh sách tất cả user
    [2] GET /users/:id : tìm một user theo ID
    [3] DELETE /users/delete/:id : xóa một user theo ID
    [4] POST /users/create  : thêm một user mới
    [5] PUT /users/update/:id : cập nhật thông tin user theo ID
    `;

  res.type("text/plain");
  res.send(text);
});

app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * from users");
  res.json(result.rows);
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * from users where id = $1', [id]);
  res.json(result.rows);
});

app.post("/users/create", async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query(
      'INSERT INTO users name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/users/update/:id", async (req, res) => {
  const { id } = req.params;
  const { Name } = req.body;

  console.log(`Đang yêu cầu sửa ID: ${id} thành Name: ${Name}`);

  try {
    const query = 'UPDATE users SET "Name" = $1 WHERE "ID" = $2 RETURNING *';
    const values = [Name, id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy User này trên database Render!" });
    }

    res.json({
      message: "Cập nhật thành công trực tiếp lên Render!",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Lỗi thực thi SQL:", err.message);
    res.status(500).json({ message: "Lỗi hệ thống", error: err.message });
  }
});

app.delete("/users/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
