const express = require("express");
const pool = require("./db");

const {
  addCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
} = require("./route/category");

const {
  addInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoiceById,
  getAllInvoice,
} = require("./route/invoice");

const {
  addInvoiceDetail,
  updateInvoiceDetail,
  deleteInvoiceDetail,
  getInvoiceDetailById,
} = require("./route/invoiceDetail");

const {
  insertProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("./route/product");

const {
  insertImage,
  getAllImages,
  getImagesByProduct,
  updateImage,
  deleteImage,
  deleteSingleImage,
} = require("./route/image");

const userController = require("./route/user");

const accountController = require("./route/account");

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
  const result = await pool.query("SELECT * from users where id = $1", [id]);
  res.json(result.rows);
});

app.post("/users/create", async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query(
      "INSERT INTO users (name) VALUES ($1) RETURNING *",
      [name],
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/users/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  console.log(`Đang yêu cầu sửa ID: ${id} thành Name: ${name}`);

  try {
    const query = "UPDATE users SET name = $1 WHERE id = $2 RETURNING *";
    const values = [name, id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy User này trên database!" });
    }

    res.json({
      message: "Cập nhật thành công!",
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
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id],
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/category/add", addCategory);
app.get("/category/all", getAllCategories);
app.delete("/category/delete/:id", deleteCategory);
app.patch("/category/update", updateCategory);

app.get("/user/getallUser", userController.getAllUsers);
app.post("/user/registerUser", userController.registerUser);
app.put("/user/updateUser/:id", userController.updateUser);

app.post("/invoice/insert", addInvoice);
app.get("/invoice/all", getAllInvoice);
app.get("/invoice/:id", getInvoiceById);
app.delete("/invoice/delete/:id", deleteInvoice);
app.patch("/invoice/update", updateInvoice);

app.post("/invoiceDetail/add", addInvoiceDetail);
app.patch("/invoiceDetail/update", updateInvoiceDetail);
app.delete("/invoiceDetail/delete/:id", deleteInvoiceDetail);
app.get("/invoiceDetail/getById/:id", getInvoiceDetailById);

app.post("/product/insertProduct", insertProduct);
app.get("/product/getAllProducts", getAllProducts);
app.get("/product/:id", getProductById);
app.patch("/product/updateProduct", updateProduct);
app.delete("/product/deleteProduct/:id", deleteProduct);

app.post("/image/insertImage", insertImage);
app.get("/image/getAllImages", getAllImages);
app.get("/image/product/:productid", getImagesByProduct);
app.patch("/image/updateImage", updateImage);
app.delete("/image/deleteImage/:productid", deleteImage);
app.delete("/image/deleteSingleImage/:productid/:detail", deleteSingleImage);

app.post("/account/login", accountController.login);
app.post("/account/logout", accountController.logout);
app.put("/account/changePassword", accountController.changePassword);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
