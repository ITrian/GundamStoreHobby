const { phone : Phone } = require('../models');

const findAll = async () => {
    return await Phone.findAll();
};

const findById = async (userId) => {
    return await Phone.findOne({
        where: {
            userId: userId
        }
    });
};

const create = async ( userId, phoneNumber ) => {
    return await Phone.create({ userId, phoneNumber });
};

const update = async ( userId, phoneNumber) => {
    const phone = await Phone.findOne({
        where: {
            userId: userId,
            phoneNumber: phoneNumber
        }
    });
    if (!phone) return null;
    return await phone.update({ userId, phoneNumber });
};

const destroy = async (userId, phoneNumber) => {
  const phone = await Phone.findOne({
    where: {
      userId: userId,
      phoneNumber: phoneNumber
    }
  });

  if (!phone) return null;
  return await phone.destroy();
};

module.exports = { findAll, findById, create, update, destroy };