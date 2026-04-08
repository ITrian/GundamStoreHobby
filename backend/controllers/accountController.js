const accountService = require("../services/accountService");
const tokenService = require("../services/tokenService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
        const { userid, username, password } = req.body;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAccount = await accountService.add(userid, username, hashedPassword, true);
        res.status(201).json(newAccount);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const userid = req.params.userid;
        const { username, password, isactived } = req.body;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const updatedAccount = await accountService.update(userid, username, hashedPassword, isactived);
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

const login = async (req, res) => {
    const { username, password } = req.body;
    const account = await accountService.getByUsername(username);
    if (!account) return res.status(404).json();
    try {
        if (await bcrypt.compare(password, account.password)) {
            const payload = { userid: account.userid, username: account.username, isactived: account.isactived };
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
            await tokenService.create(account.username, refreshToken, new Date(), new Date(Date.now() + 24 * 60 * 60 * 1000), false);
            res.json({ accessToken: accessToken, refreshToken: refreshToken});
        } else {
            res.json({ error: "Sai mật khẩu"});
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const logout = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "Thiếu refresh token" });
    try {
        const storedToken = await tokenService.findByToken(refreshToken);
        if (!storedToken) return res.status(404).json({ error: "Không tìm thấy token" });
        await tokenService.revoke(refreshToken);
        res.json({ message: "Đăng xuất thành công" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getAll, getByUsername, add, update, remove, login, logout };
