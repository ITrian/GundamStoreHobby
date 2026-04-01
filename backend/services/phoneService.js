const phoneRepository = require('../repositories/phoneRepository');

const getAll = async () => {
    return await phoneRepository.findAll();
};

const getById = async (userId) => {
    if (!userId) throw new Error("Thiếu Id người dùng");
    return await phoneRepository.findById(userId);
};

const add = async (userId, phoneNumber) => {
    if (!userId || !phoneNumber) throw new Error("Thiếu ID người dùng hoặc số điện thoại");
    return await phoneRepository.create(userId, phoneNumber);
};

const edit = async ( userId, phoneNumber) => {
    if (!userId || !phoneNumber) throw new Error("Thiếu ID điện thoại, ID người dùng hoặc số điện thoại");
    return await phoneRepository.update(userId, phoneNumber);
};

const deleteNumber = async (userId, phoneNumber) => {
    if (!userId || !phoneNumber) throw new Error("Thiếu ID người dùng hoặc số điện thoại");
    return await phoneRepository.destroy(userId, phoneNumber);
};

module.exports = { getAll, getById, add, edit, deleteNumber };