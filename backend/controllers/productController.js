const productService = require("../services/productService");

const getAllProducts = async (req, res) => {
  try {
    const data = await productService.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const insertProduct = async (req, res) => {
  try {
    const data = await productService.add(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await productService.getById(id);

    if (!data) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const data = await productService.edit(req.body);

    if (!data) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await productService.deleteById(id);

    if (!data) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    res.json({ message: "Xóa thành công", data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllProducts,
  insertProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
