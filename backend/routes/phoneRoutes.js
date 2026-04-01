const express = require('express');
const router = express.Router();
const phoneController = require('../controllers/phoneController');

router.get("/", phoneController.getAll);
router.post("/", phoneController.add);
router.get("/:id", phoneController.getById);
router.put("/:id", phoneController.edit);
router.delete("/:id", phoneController.deleteNumber);

module.exports = router;