const categoryService = require("../services/categoryService");

const getAllCategories = async (req, res) => {
    try {
        const data = await categoryService.getAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const data = await categoryService.add(name);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id, name } = req.body;
        const data = await categoryService.edit(id, name);
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await categoryService.deleteById(id);
        res.json({ message: "Xóa thành công", data });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { getAllCategories, addCategory, updateCategory, deleteCategory };