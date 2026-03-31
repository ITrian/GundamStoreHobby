const categoryRepository = require("../repositories/categoryRepository");

const getAll = async () => {
    return await categoryRepository.findAll();
};

const add = async (name) => {
    if (!name) throw new Error("Tên danh mục không được để trống");
    return await categoryRepository.create(name);
};

const edit = async (id, name) => {
    if (!id || !name) throw new Error("Thiếu ID hoặc tên danh mục");
    return await categoryRepository.update(id, name);
};

const deleteById = async (id) => {
    if (!id) throw new Error("Thiếu ID danh mục cần xóa");
    return await categoryRepository.remove(id);
};

module.exports = { getAll, add, edit, deleteById };