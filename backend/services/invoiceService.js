const invoiceRepository = require("../repositories/invoiceRepository");

const getAll = async () => {
  return await invoiceRepository.findAll();
};

const getById = async (id) => {
  if (!id) throw new Error("Thiếu ID hóa đơn");
  return await invoiceRepository.findById(id);
};

const add = async (payload) => {
  const { date, customerId, status, isPaid, totalPrice } = payload;
  if (!date || !customerId || !status || isPaid === undefined || totalPrice === undefined) {
    throw new Error("Thiếu dữ liệu hóa đơn");
  }
  return await invoiceRepository.create(payload);
};

const edit = async (payload) => {
  if (!payload.id) throw new Error("Thiếu ID hóa đơn");
  return await invoiceRepository.update(payload);
};

const deleteById = async (id) => {
  if (!id) throw new Error("Thiếu ID hóa đơn cần xóa");
  return await invoiceRepository.remove(id);
};

module.exports = { getAll, getById, add, edit, deleteById };
