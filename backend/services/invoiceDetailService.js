const invoiceDetailRepository = require("../repositories/invoiceDetailRepository");

const getByInvoiceId = async (invoiceId) => {
  if (!invoiceId) throw new Error("Thiếu invoiceId");
  return await invoiceDetailRepository.findByInvoiceId(invoiceId);
};

const add = async (payload) => {
  const { invoiceId, productId, unitPrice, quantity } = payload;
  if (!invoiceId || !productId || unitPrice === undefined || quantity === undefined) {
    throw new Error("Thiếu dữ liệu chi tiết hóa đơn");
  }
  return await invoiceDetailRepository.create(payload);
};

const edit = async (payload) => {
  const { invoiceId, productId } = payload;
  if (!invoiceId || !productId) throw new Error("Thiếu invoiceId hoặc productId");
  return await invoiceDetailRepository.update(payload);
};

const deleteById = async (invoiceId, productId) => {
  if (!invoiceId || !productId) throw new Error("Thiếu invoiceId hoặc productId");
  return await invoiceDetailRepository.remove({ invoiceId, productId });
};

module.exports = { getByInvoiceId, add, edit, deleteById };
