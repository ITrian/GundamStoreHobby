const pool = require("../db");

async function addInvoice(req, res) {
    try {
        const { date, customerId, status, isPaid, paymentMethod, totalPrice} = req.body;
        const result = await pool.query("INSERT INTO invoice (date, customerid, status, ispaid, paymentmethod, totalprice) VALUES"
            + "($1, $2, $3, $4, $5, $6) RETURNING *", [date, customerId, status, isPaid, paymentMethod, totalPrice]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Lỗi thêm hóa đơn"});
    }
}

async function updateInvoice(req, res) {
    try {
        const { date, customerId, status, isPaid, paymentMethod, totalPrice} = req.body;
        const result = await pool.query("UPDATE invoice SET date=$1, customerid=$2, status=$3, ispaid=$4, paymentmethod=$5, totalprice=$6 WHERE id=$7 RETURNING *", [date, customerId, status, isPaid, paymentMethod, totalPrice, req.params.id]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Lỗi cập nhật hóa đơn"});
    }
}

async function deleteInvoice(req, res) {
    try {
        const result = await pool.query("DELETE FROM invoice WHERE id=$1 RETURNING *", [req.params.id]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Lỗi xóa hóa đơn"});
    }
}

async function getInvoiceById(req, res) {
    try {
        console.log("getInvoiceById called with id:", req.params.id);
        const result = await pool.query("SELECT * FROM invoice WHERE id=$1", [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({error: "Hóa đơn không tồn tại"});
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("getInvoiceById error:", err.message);
        res.status(500).json({error: err.message});
    }
}

async function getAllInvoice(req, res) {
    try {
        const result = await pool.query("SELECT * FROM invoice");
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Lỗi lấy thông tin hóa đơn"});
    }
}

module.exports = {
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceById,
    getAllInvoice
};