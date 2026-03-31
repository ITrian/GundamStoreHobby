const pool = require("../db");

async function addInvoiceDetail(req, res) {
    try {
        const { invoiceId, productId, unitPrice, quantity, discount } = req.body;
        const result = await pool.query("INSERT INTO invoicedetail (invoiceid, productid, unitprice, quantity, discount) VALUES ($1, $2, $3, $4, $5) RETURNING *", [invoiceId, productId, unitPrice, quantity, discount]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        consoler.error(err);
        res.status(500).json({error: "Lỗi thêm chi tiết hóa đơn"});
    }
}

async function updateInvoiceDetail(req, res) {
    try {
        const { invoiceId, productId, unitPrice, quantity, discount } = req.body;
        const result = await pool.query("UPDATE invoicedetail SET unitprice=$1, quantity=$2, discount=$3 WHERE invoiceid=$4 AND productid=$5 RETURNING *", [unitPrice, quantity, discount, invoiceId, productId]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Lỗi cập nhật chi tiết hóa đơn"});
    }
}

async function deleteInvoiceDetail(req, res) {
    try {
        const { invoiceId } = req.params;
        const { productId } = req.body;
        const result = await pool.query("DELETE FROM invoicedetail WHERE invoiceid=$1 AND productid=$2 RETURNING *", [invoiceId, productId]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Lỗi xóa chi tiết hóa đơn"});
    }
}

async function getInvoiceDetailById(req, res) {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM invoicedetail WHERE invoiceid=$1", [invoiceId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Lỗi lấy thông tin chi tiết hóa đơn"});
    }
}

module.exports = {
    addInvoiceDetail,
    updateInvoiceDetail,
    deleteInvoiceDetail,
    getInvoiceDetailById
};