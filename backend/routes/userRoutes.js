const express = require('express');
const router = express.Router(); 
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authen");

router.get("/", userController.getAllUsers);
router.post("/", userController.addUser);
router.put("/:id", authenticate.authenticateToken, userController.updateUser);
router.delete("/:id", authenticate.authenticateToken, userController.deleteUser);

module.exports = router;