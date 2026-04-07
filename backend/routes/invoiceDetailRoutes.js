const express = require("express");
const router = express.Router();
const invoiceDetailController = require("../controllers/invoiceDetailController");
const authenticate = require("../middlewares/authen");

router.get("/:id", invoiceDetailController.getInvoiceDetailById);
router.post("/", authenticate.authenticateToken, invoiceDetailController.addInvoiceDetail);
router.patch("/", authenticate.authenticateToken, invoiceDetailController.updateInvoiceDetail);
router.delete("/", authenticate.authenticateToken, invoiceDetailController.deleteInvoiceDetail);

module.exports = router;