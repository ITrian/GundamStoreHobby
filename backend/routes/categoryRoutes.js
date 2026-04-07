const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authenticate = require("../middlewares/authen");

router.get("/", categoryController.getAllCategories);
router.post("/", authenticate.authenticateToken, categoryController.addCategory);
router.put("/:id", authenticate.authenticateToken, categoryController.updateCategory);
router.delete("/:id", authenticate.authenticateToken, categoryController.deleteCategory);

module.exports = router;
