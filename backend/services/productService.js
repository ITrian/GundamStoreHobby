const productRepository = require("../repositories/productRepository");

const getAll = async () => {
  return await productRepository.findAll();
};

const getById = async (id) => {
  if (!id) throw new Error("Thiếu ID sản phẩm");
  return await productRepository.findById(id);
};

const add = async (payload) => {
  const { name, quantity, categoryid, price } = payload;
  if (!name || quantity === undefined || !categoryid || price === undefined) {
    throw new Error("Thiếu dữ liệu sản phẩm");
  }
  return await productRepository.create(payload);
};

const edit = async (payload) => {
  if (!payload.id) throw new Error("Phải có id");
  return await productRepository.update(payload);
};

const deleteById = async (id) => {
  if (!id) throw new Error("Thiếu ID sản phẩm cần xóa");
  return await productRepository.remove(id);
};

module.exports = { getAll, getById, add, edit, deleteById };