const imageRepository = require("../repositories/imageRepository");

const getAll = async () => {
  return await imageRepository.findAll();
};

const getByProduct = async (productid) => {
  if (!productid) throw new Error("Thiếu productid");
  return await imageRepository.findByProduct(productid);
};

const add = async (payload) => {
  const { productid, detail, link } = payload;
  if (!productid || !detail || !link) {
    throw new Error("Thiếu dữ liệu image");
  }
  return await imageRepository.create(payload);
};

const edit = async (payload) => {
  if (!payload.productid) throw new Error("Thiếu productid");
  return await imageRepository.update(payload);
};

const deleteByProduct = async (productid) => {
  if (!productid) throw new Error("Thiếu productid");
  return await imageRepository.removeByProduct(productid);
};

const deleteSingle = async ({ productid, detail }) => {
  if (!productid || !detail) throw new Error("Thiếu productid hoặc detail");
  return await imageRepository.removeSingle({ productid, detail });
};

module.exports = { getAll, getByProduct, add, edit, deleteByProduct, deleteSingle };