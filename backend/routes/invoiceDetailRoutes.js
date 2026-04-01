const express = require("express");
const router = express.Router();
const invoiceDetailController = require("../controllers/invoiceDetailController");

router.get("/:id", invoiceDetailController.getInvoiceDetailById);
router.post("/", invoiceDetailController.addInvoiceDetail);
router.patch("/", invoiceDetailController.updateInvoiceDetail);
router.delete("/", invoiceDetailController.deleteInvoiceDetail);

module.exports = router;
