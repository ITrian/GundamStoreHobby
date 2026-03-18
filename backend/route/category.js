const pool = require("../db");

async function insertCategory(req, res) {
    try {
        const {name} = req.body;
        const result = await pool.query("INSERT INTO category (name) VALUES ($1) RETURNING *", [name]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Lỗi thêm danh mục"});
    }
}

async function getAllCategories(req, res) {
    try {
        const result = await pool.query("SELECT * FROM category");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Lỗi lấy danh mục"});
    }
}

async function deleteCategory(req, res) {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM category WHERE id = $1 RETURNING *", [id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Lỗi xóa danh mục"});
    }
}

async function updateCategory(req, res) {
    try {
        const { id, name } = req.body;
        const result = await pool.query("UPDATE category SET name = $1 WHERE id = $2 RETURNING *", [name, id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Lỗi cập nhật danh mục"});
    }
}

module.exports.insert = insertCategory;
module.exports.getAll = getAllCategories;
module.exports.delete = deleteCategory;
module.exports.update = updateCategory;