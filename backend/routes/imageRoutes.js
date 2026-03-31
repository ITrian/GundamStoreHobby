const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");

router.get("/", imageController.getAllImages);
router.post("/", imageController.insertImage);
router.get("/product/:productid", imageController.getImagesByProduct);
router.patch("/", imageController.updateImage);
router.delete("/:productid", imageController.deleteImage);
router.delete("/:productid/:detail", imageController.deleteSingleImage);

module.exports = router;