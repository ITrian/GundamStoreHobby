const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const authenticate = require("../middlewares/authen");

router.get("/", accountController.getAll);
router.post("/", accountController.add);
router.get("/:username", accountController.getByUsername);
router.put("/:userid", authenticate.authenticateToken, accountController.update);
router.delete("/:userid", authenticate.authenticateToken, accountController.remove);
router.post("/login", accountController.login);
router.post("/logout", accountController.logout);

module.exports = router;