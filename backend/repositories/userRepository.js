const { user: User } = require("../models");

const findAll = async () => {
    return await User.findAll();
};

const findById = async (id) => {
    return await User.findByPk(id);
};

const create = async ( name, dateofbirth, email, address, isadmin ) => {
    return await User.create({ name, dateofbirth, email, address, isadmin });
};

const update = async (id, name, dateofbirth, email, address, isadmin) => {
    const user = await User.findByPk(id);
    if (!user) return null;

    user.name = name;
    user.dateofbirth = dateofbirth;
    user.email = email;
    user.address = address;
    user.isadmin = isadmin;

    await user.save();
    return user;
};

const remove = async (id) => {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.destroy();
    return user;
}

module.exports = { findAll, findById, create, update, remove };