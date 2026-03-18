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

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteImage(req, res) {
  try {
    const { productid } = req.params;

    await pool.query(
      "DELETE FROM image WHERE productid=$1",
      [productid]
    );

    res.json({ message: "Xóa image theo product thành công" });
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
};