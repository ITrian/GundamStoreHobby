const { product: Product } = require("../models");

const findAll = async () => {
  return await Product.findAll({
    order: [["id", "ASC"]],
  });
};

const findById = async (id) => {
  return await Product.findByPk(id);
};

const create = async ({ name, quantity, detail, categoryid, price }) => {
  return await Product.create({
    name,
    quantity,
    detail,
    categoryid,
    price,
    createat: new Date(),
  });
};

const update = async ({ id, name, quantity, detail, categoryid, price }) => {
  const product = await Product.findByPk(id);
  if (!product) return null;

  product.name = name;
  product.quantity = quantity;
  product.detail = detail;
  product.categoryid = categoryid;
  product.price = price;
  await product.save();
  return product;
};

const remove = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) return null;

  await product.destroy();
  return product;
};

module.exports = { findAll, findById, create, update, remove };