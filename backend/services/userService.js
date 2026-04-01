const userRepository = require("../repositories/userRepository");

const getAll = async () => {
    return await userRepository.findAll();
};

const add = async (name, dateofbirth, email, address, isadmin) => {
    if (!name || !dateofbirth || !email || !address || isadmin === undefined) {
        throw new Error("Thiếu dữ liệu người dùng");
    }
    return await userRepository.create(name, dateofbirth, email, address, isadmin);
};

const update = async (id, name, dateofbirth, email, address, isadmin) => {
    if (!id || !name || !dateofbirth || !email || !address || isadmin === undefined) {
        throw new Error("Thiếu dữ liệu người dùng");
    }
    return await userRepository.update(id, name, dateofbirth, email, address, isadmin);
};

const deleteById = async (id) => {
    if (!id) throw new Error("Thiếu ID người dùng cần xóa");
    return await userRepository.remove(id);
};

module.exports = { getAll, add, update, deleteById };