const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

router.get("/", invoiceController.getAllInvoice);
router.post("/", invoiceController.addInvoice);
router.get("/:id", invoiceController.getInvoiceById);
router.patch("/", invoiceController.updateInvoice);
router.delete("/:id", invoiceController.deleteInvoice);

module.exports = router;
