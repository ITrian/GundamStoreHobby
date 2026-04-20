const { user } = require("../models");
const userService = require("../services/userService");
const accountService = require("../services/accountService");

const getAllUsers = async (req, res) => {
    try {
        const data = await userService.getAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addUser = async (req, res) => {
    try {
        const { name, dateofbirth, email, address, isadmin, phone } = req.body;
        const data = await userService.add(name, dateofbirth, email, address, isadmin, phone);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message});
    }
};

const updateUser = async (req, res) => {
    try {
        const { id, name, dateofbirth, email, address, isadmin, phone } = req.body;
        const data = await userService.update(id, name, dateofbirth, email, address, isadmin, phone);
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.deleteById(id);
        const account = await accountService.deleteByUserId(id);
        const data = { user, account };
        res.json({ message: "Xóa thành công", data });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { getAllUsers, addUser, updateUser, deleteUser };