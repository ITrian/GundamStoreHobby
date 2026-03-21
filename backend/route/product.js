const pool = require("../db");

async function insertProduct(req, res) {
  try {
    const { name, quantity, detail, categoryid, price } = req.body;

    const result = await pool.query(
      `INSERT INTO product (name, quantity, detail, categoryid, price, createat)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [name, quantity, detail, categoryid, price]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function getAllProducts(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM product ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM product WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi lấy sản phẩm" });
  }
}

async function updateProduct(req, res) {
  try {
    const { id, name, quantity, detail, categoryid, price } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Phải có id" });
    }

    const result = await pool.query(
      `UPDATE product 
       SET name=$1, quantity=$2, detail=$3, categoryid=$4, price=$5
       WHERE id=$6
       RETURNING *`,
      [name, quantity, detail, categoryid, price, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM product WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json({ message: "Xóa sản phẩm thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi xóa sản phẩm" });
  }
}

module.exports = {
  insertProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};