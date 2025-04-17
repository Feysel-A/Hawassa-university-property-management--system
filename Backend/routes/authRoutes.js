const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validateUserInput = require("../middleware/validateUserInput");

router.post("/register", validateUserInput, authController.register);
router.post("/login", authController.login); // NEW

module.exports = router;
