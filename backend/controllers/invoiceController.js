const invoiceService = require("../services/invoiceService");

const getAllInvoice = async (req, res) => {
  try {
    const data = await invoiceService.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await invoiceService.getById(id);

    if (!data) {
      return res.status(404).json({ error: "Hóa đơn không tồn tại" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addInvoice = async (req, res) => {
  try {
    const data = await invoiceService.add(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const data = await invoiceService.edit(req.body);

    if (!data) {
      return res.status(404).json({ error: "Hóa đơn không tồn tại" });
    }

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await invoiceService.deleteById(id);

    if (!data) {
      return res.status(404).json({ error: "Hóa đơn không tồn tại" });
    }

    res.json({ message: "Xóa thành công", data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllInvoice,
  getInvoiceById,
  addInvoice,
  updateInvoice,
  deleteInvoice,
};
