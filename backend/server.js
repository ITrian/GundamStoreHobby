const express = require("express");
const pool = require("./db");

const app = express();

const cors = require("cors");
app.use(cors()); // Thêm dòng này trước các route

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend đang hoạt động\n[1] GET /testdb: kiểm tra kết nối cơ sở dữ liệu\n[2] GET /users__getAll: lấy danh sách tất cả bản ghi trong bảng users");
});

app.get("/testdb", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});

app.get("/users__getAll", async (req, res) => {
  const result = await pool.query("SELECT * from users");
  res.json(result.rows);
})

app.get("/users__getById/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * from users where id = $1", [id]);
  res.json(result.rows);
});

app.post("/users__create", async (req, res) => {
  const { id, name } = req.body;
  const result = await pool.query("INSERT INTO users (id, name) VALUES ($1, $2) RETURNING *", [id, name]);
  res.json(result.rows[0]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});