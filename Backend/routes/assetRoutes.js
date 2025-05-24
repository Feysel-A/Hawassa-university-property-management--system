const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");

router.get("/", assetController.getAllAssets);
router.post("/", assetController.registerAsset);
router.put("/dispose/:id", assetController.disposeAsset);

module.exports = router;
