const accountService = require("../services/accountService");

const getAll = async (req, res) => {
    try {
        const accounts = await accountService.getAll();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getByUsername = async (req, res) => {
    try {
        const account = await accountService.getByUsername(req.params.username);
        if (!account) return res.status(404).json({ error: "Khong tim thay tai khoan" });
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const add = async (req, res) => {
    try {
        const { userid, username, password, isactived } = req.body;
        const newAccount = await accountService.add(userid, username, password, isactived);
        res.status(201).json(newAccount);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { userid, username, password, isactived } = req.body;
        const updatedAccount = await accountService.update(userid, username, password, isactived);
        if (!updatedAccount) return res.status(404).json({ error: "Khong tim thay tai khoan" });
        res.json(updatedAccount);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { userid } = req.params;
        const deletedAccount = await accountService.remove(userid);
        if (!deletedAccount) return res.status(404).json({ error: "Khong tim thay tai khoan" });
        res.json({ message: "Xoa tai khoan thanh cong" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAll, getByUsername, add, update, remove };
