const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/summary", reportController.getSummaryReport);
router.get("/chart-data", reportController.getMonthlyChartData);
router.get("/statistics", reportController.getStatistics);
router.get("/details/:type", reportController.getDetailsByType);

module.exports = router;
