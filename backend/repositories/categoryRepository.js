const { Category } = require("../models");

const findAll = async () => {
  return await Category.findAll();
};

const create = async (name) => {
  return await Category.create({ name });
};

const update = async (id, name) => {
  const category = await Category.findByPk(id);
  if (!category) return null;

  category.name = name;
  await category.save();
  return category;
};

const remove = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) return null;

  await category.destroy();
  return category;
};

module.exports = { findAll, create, update, remove };
