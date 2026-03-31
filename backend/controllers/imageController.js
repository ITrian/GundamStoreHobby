const imageService = require("../services/imageService");

const getAllImages = async (req, res) => {
  try {
    const data = await imageService.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const insertImage = async (req, res) => {
  try {
    const data = await imageService.add(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getImagesByProduct = async (req, res) => {
  try {
    const { productid } = req.params;
    const data = await imageService.getByProduct(productid);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateImage = async (req, res) => {
  try {
    const data = await imageService.edit(req.body);

    if (!data) {
      return res.status(404).json({ error: "Image không tồn tại" });
    }

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { productid } = req.params;
    const deleted = await imageService.deleteByProduct(productid);

    if (deleted === 0) {
      return res.status(404).json({ error: "Image không tồn tại" });
    }

    res.json({ message: "Xóa thành công", deleted });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteSingleImage = async (req, res) => {
  try {
    const { productid, detail } = req.params;
    const deleted = await imageService.deleteSingle({ productid, detail });

    if (deleted === 0) {
      return res.status(404).json({ error: "Image không tồn tại" });
    }

    res.json({ message: "Xóa thành công", deleted });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllImages,
  insertImage,
  getImagesByProduct,
  updateImage,
  deleteImage,
  deleteSingleImage,
};
