const invoiceDetailService = require("../services/invoiceDetailService");

const getInvoiceDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await invoiceDetailService.getByInvoiceId(id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addInvoiceDetail = async (req, res) => {
  try {
    const data = await invoiceDetailService.add(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateInvoiceDetail = async (req, res) => {
  try {
    const data = await invoiceDetailService.edit(req.body);

    if (!data) {
      return res.status(404).json({ error: "Chi tiết hóa đơn không tồn tại" });
    }

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteInvoiceDetail = async (req, res) => {
  try {
    const { invoiceId, productId } = req.body;
    const data = await invoiceDetailService.deleteById(invoiceId, productId);

    if (!data) {
      return res.status(404).json({ error: "Chi tiết hóa đơn không tồn tại" });
    }

    res.json({ message: "Xóa thành công", data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getInvoiceDetailById,
  addInvoiceDetail,
  updateInvoiceDetail,
  deleteInvoiceDetail,
};
