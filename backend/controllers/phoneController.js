const phoneService = require('../services/phoneService');

const getAll = async (req, res) => {
    try {
        const phones = await phoneService.getAll();
        res.json(phones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const phone = await phoneService.getById(req.params.id);
        if (!phone) return res.status(404).json({ error: 'Khong tim thay so dien thoai' });
        res.json(phone);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const add = async (req, res) => {
    try {
        const { userId, phoneNumber } = req.body;
        const newPhone = await phoneService.add(userId, phoneNumber);
        res.status(201).json(newPhone);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const edit = async (req, res) => {
    try {
        const { userId } = req.params;
        const { phoneNumber } = req.body;
        const updatedPhone = await phoneService.edit(userId, phoneNumber);
        if (!updatedPhone) return res.status(404).json({ error: 'Khong tim thay so dien thoai' });
        res.json(updatedPhone);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteNumber = async (req, res) => {
    try {
        const { userId } = req.params;
        const { phoneNumber } = req.body;
        const deletedPhone = await phoneService.deleteNumber(userId, phoneNumber);
        if (!deletedPhone) return res.status(404).json({ error: 'Khong tim thay so dien thoai' });
        res.json({ message: 'Xoa so dien thoai thanh cong' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAll, getById, add, edit, deleteNumber };
