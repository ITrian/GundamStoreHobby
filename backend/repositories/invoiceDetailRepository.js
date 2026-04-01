const { invoiceDetail: InvoiceDetail } = require("../models");

const findByInvoiceId = async (invoiceid) => {
  return await InvoiceDetail.findAll({
    where: { invoiceid },
  });
};

const create = async ({ invoiceId, productId, unitPrice, quantity, discount }) => {
  return await InvoiceDetail.create({
    invoiceid: invoiceId,
    productid: productId,
    unitprice: unitPrice,
    quantity,
    discount,
  });
};

const update = async ({ invoiceId, productId, unitPrice, quantity, discount }) => {
  const detail = await InvoiceDetail.findOne({
    where: {
      invoiceid: invoiceId,
      productid: productId,
    },
  });

  if (!detail) return null;

  detail.unitprice = unitPrice;
  detail.quantity = quantity;
  detail.discount = discount;
  await detail.save();
  return detail;
};

const remove = async ({ invoiceId, productId }) => {
  const detail = await InvoiceDetail.findOne({
    where: {
      invoiceid: invoiceId,
      productid: productId,
    },
  });

  if (!detail) return null;

  await detail.destroy();
  return detail;
};

module.exports = { findByInvoiceId, create, update, remove };
