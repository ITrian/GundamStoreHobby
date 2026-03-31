const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.getAllProducts);
router.post("/", productController.insertProduct);
router.get("/:id", productController.getProductById);
router.patch("/", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;