const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const authenticate = require("../middlewares/authen");

router.get("/", invoiceController.getAllInvoice);
router.post("/", authenticate.authenticateToken, invoiceController.addInvoice);
router.get("/:id", invoiceController.getInvoiceById);
router.patch("/", authenticate.authenticateToken, invoiceController.updateInvoice);
router.delete("/:id", authenticate.authenticateToken, invoiceController.deleteInvoice);

module.exports = router;
