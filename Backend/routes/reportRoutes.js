const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/enhanced-report", reportController.getEnhancedReport);
router.get("/statistics", reportController.getStatistics);
router.get("/details/:type", reportController.getDetailsByType);

module.exports = router;
