const { token : Token } = require("../models");

const create = async (userid, token, issuedat, expiresat, isrevoked) => {
    return await Token.create({ userid, token, issuedat, expiresat, isrevoked });
};

const findByToken = async (token) => {
    return await Token.findOne({
        where: {
            token: token
        }
    });
};

const revoke = async (token) => {
    const existingToken = await Token.findOne({
        where: {
            token: token
        }
    });
    if (!existingToken) return null;
    existingToken.isrevoked = true;
    await existingToken.save();
    return existingToken;
};

module.exports = { create, findByToken, revoke };