const { image: Image } = require("../models");

const findAll = async () => {
  return await Image.findAll();
};

const findByProduct = async (productid) => {
  return await Image.findAll({ where: { productid } });
};

const create = async ({ productid, detail, link }) => {
  return await Image.create({ productid, detail, link });
};

const update = async ({ productid, detail, link }) => {
  const [count, rows] = await Image.update(
    { detail, link },
    {
      where: { productid },
      returning: true,
    },
  );
  if (count === 0) return null;
  return rows[0];
};

const removeByProduct = async (productid) => {
  return await Image.destroy({ where: { productid } });
};

const removeSingle = async ({ productid, detail }) => {
  return await Image.destroy({ where: { productid, detail } });
};

module.exports = { findAll, findByProduct, create, update, removeByProduct, removeSingle };