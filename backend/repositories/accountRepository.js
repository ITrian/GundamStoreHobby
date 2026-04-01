const { account : Account } = require("../models");

const findAll = async () => {
    return await Account.findAll();
};

const findByUsername = async (username) => {
    return await Account.findOne({
        where: {
            username: username
        }
    });
};

const create = async ( userid, username, password, isactived) => {
    return await Account.create({ userid, username, password, isactived });
};

const update = async ( userid, username, password, isactived) => {
    const account = await Account.findOne({
        where: {
            userid: userid
        }});
    if (!account) return null;
    return await account.update({ username, password, isactived });
};

const destroy = async (userid) => {
  const account = await Account.findOne({
    where: {
      userid: userid
    }
  });
  if (!account) return null;
  return await account.destroy();
};

module.exports = { findAll, findByUsername, create, update, destroy };