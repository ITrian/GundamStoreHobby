const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

router.get("/", accountController.getAll);
router.post("/", accountController.add);
router.get("/:username", accountController.getByUsername);
router.put("/:userid", accountController.update);
router.delete("/:userid", accountController.remove);

module.exports = router;