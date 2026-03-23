const pool = require("../db");

async function insertImage(req, res) {
  try {
    const { productid, detail, link } = req.body;

    const result = await pool.query(
      `INSERT INTO image (productid, detail, link)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [productid, detail, link]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function getAllImages(req, res) {
  try {
    const result = await pool.query("SELECT * FROM image");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function getImagesByProduct(req, res) {
  try {
    const { productid } = req.params;

    const result = await pool.query(
      "SELECT * FROM image WHERE productid = $1",
      [productid]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function updateImage(req, res) {
  try {
    const { productid, detail, link } = req.body;

    const result = await pool.query(
      `UPDATE image
       SET detail=$1, link=$2
       WHERE productid=$3
       RETURNING *`,
      [detail, link, productid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Image không tồn tại" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteImage(req, res) {
  try {
    const { productid } = req.params;

    const result = await pool.query(
      "DELETE FROM image WHERE productid=$1",
      [productid]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Image không tồn tại" });
    }

    res.json({ message: "Xóa image theo product thành công", deleted: result.rowCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteSingleImage(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM image WHERE id=$1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Image không tồn tại" });
    }

    res.json({ message: "Xóa image thành công", deleted: result.rowCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  insertImage,
  getAllImages,
  getImagesByProduct,
  updateImage,
  deleteImage,
  deleteSingleImage,
};