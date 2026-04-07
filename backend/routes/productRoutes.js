const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticate = require("../middlewares/authen");

router.get("/", authenticate.authenticateToken, productController.getAllProducts);
router.post("/", authenticate.authenticateToken, productController.insertProduct);
router.get("/:id", authenticate.authenticateToken, productController.getProductById);
router.patch("/", authenticate.authenticateToken, productController.updateProduct);
router.delete("/:id", authenticate.authenticateToken, productController.deleteProduct);

module.exports = router;