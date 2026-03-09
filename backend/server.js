const express = require("express");
const pool = require("./db");

const app = express();

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});