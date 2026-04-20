const userRepository = require("../repositories/userRepository");

const getAll = async () => {
    return await userRepository.findAll();
};

const getById = async (id) => {
    if (!id) throw new Error("Thiếu ID người dùng");
    return await userRepository.findById(id);
}

const add = async (name, dateofbirth, email, address, isadmin, phone) => {
    if (!name || !dateofbirth || !email || !address || isadmin === undefined) {
        throw new Error("Thiếu dữ liệu người dùng");
    }
    if (!phone) {
        phone = null;
    }
    return await userRepository.create(name, dateofbirth, email, address, isadmin, phone);
};

const update = async (id, name, dateofbirth, email, address, isadmin, phone) => {
    if (!id || !name || !dateofbirth || !email || !address || isadmin === undefined) {
        throw new Error("Thiếu dữ liệu người dùng");
    }
    if (!phone) {
        phone = null;
    }
    return await userRepository.update(id, name, dateofbirth, email, address, isadmin, phone);
};

const deleteById = async (id) => {
    if (!id) throw new Error("Thiếu ID người dùng cần xóa");
    return await userRepository.remove(id);
};

module.exports = { getAll, getById, add, update, deleteById };