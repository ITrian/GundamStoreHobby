const accountRepository = require("../repositories/accountRepository");

const getAll = async () => {
  return await accountRepository.findAll();
};

const getByUsername = async (username) => {
  if (!username) throw new Error("Thiếu tên đăng nhập");
  return await accountRepository.findByUsername(username);
};

const add = async (userid, username, password, isactived) => {
    if (!userid || !username || !password) throw new Error("Thiếu ID người dùng, tên đăng nhập hoặc mật khẩu");
    return await accountRepository.create(userid, username, password, isactived);
};

const update = async (userid, username, password, isactived) => {
    if (!userid || !username || !password) throw new Error("Thiếu ID người dùng, tên đăng nhập hoặc mật khẩu");
    return await accountRepository.update(userid, username, password, isactived);
};

const remove = async (userid) => {
    if (!userid) throw new Error("Thiếu ID người dùng");
    return await accountRepository.destroy(userid);
};

module.exports = { getAll, getByUsername, add, update, remove };
