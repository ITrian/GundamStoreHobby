const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");
const authenticate = require("../middlewares/authen");

router.get("/", authenticate.authenticateToken, imageController.getAllImages);
router.post("/", authenticate.authenticateToken, imageController.insertImage);
router.get("/product/:productid", authenticate.authenticateToken, imageController.getImagesByProduct);
router.patch("/", authenticate.authenticateToken, imageController.updateImage);
router.delete("/:productid", authenticate.authenticateToken, imageController.deleteImage);
router.delete("/:productid/:detail", authenticate.authenticateToken, imageController.deleteSingleImage);

module.exports = router;