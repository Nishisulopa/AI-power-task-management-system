const express = require("express");
const { userRegister, verifyOtp, userLogin } = require("../controler/User");

const router = express.Router();

// Register
router.post("/register", userRegister);

//Verifyotp
router.post("/verifyotp", verifyOtp);

// Login
router.post("/login", userLogin);

module.exports = router;
