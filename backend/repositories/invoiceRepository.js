const { invoice: Invoice } = require("../models");

const findAll = async () => {
  return await Invoice.findAll({
    order: [["id", "ASC"]],
  });
};

const findById = async (id) => {
  return await Invoice.findByPk(id);
};

const create = async ({ date, customerId, status, isPaid, paymentMethod, totalPrice }) => {
  return await Invoice.create({
    date,
    customerid: customerId,
    status,
    ispaid: isPaid,
    paymentmethod: paymentMethod,
    totalprice: totalPrice,
  });
};

const update = async ({ id, date, customerId, status, isPaid, paymentMethod, totalPrice }) => {
  const invoice = await Invoice.findByPk(id);
  if (!invoice) return null;

  invoice.date = date;
  invoice.customerid = customerId;
  invoice.status = status;
  invoice.ispaid = isPaid;
  invoice.paymentmethod = paymentMethod;
  invoice.totalprice = totalPrice;
  await invoice.save();
  return invoice;
};

const remove = async (id) => {
  const invoice = await Invoice.findByPk(id);
  if (!invoice) return null;

  await invoice.destroy();
  return invoice;
};

module.exports = { findAll, findById, create, update, remove };
