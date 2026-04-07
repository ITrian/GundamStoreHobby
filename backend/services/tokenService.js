const tokenRepository = require("../repositories/tokenRepository");

const create = async (username, token, issuedAt, expiresAt, isRevoke) => {
    if (!username || !token || !issuedAt || !expiresAt) throw new Error("Thiếu thông tin cần thiết để tạo token");
    return await tokenRepository.create(username, token, issuedAt, expiresAt, isRevoke);
};

const findByToken = async (token) => {
    if (!token) throw new Error("Thiếu token");
    return await tokenRepository.findByToken(token);
};

const revoke = async (token) => {
    if (!token) throw new Error("Thiếu token");
    return await tokenRepository.revoke(token);
};

module.exports = { create, findByToken, revoke };