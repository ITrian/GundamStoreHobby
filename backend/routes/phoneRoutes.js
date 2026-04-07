const express = require('express');
const router = express.Router();
const phoneController = require('../controllers/phoneController');
const authenticate = require("../middlewares/authen");

router.get("/", authenticate.authenticateToken, phoneController.getAll);
router.post("/", authenticate.authenticateToken, phoneController.add);
router.get("/:id", authenticate.authenticateToken, phoneController.getById);
router.put("/:id", authenticate.authenticateToken, phoneController.edit);
router.delete("/:id", authenticate.authenticateToken, phoneController.deleteNumber);

module.exports = router;