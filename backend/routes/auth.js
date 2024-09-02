const express = require("express");
const { register, login } = require("../controllers/authController");
const router = express.Router();

// Kullanıcı kayıt
router.post("/register", register);

// Kullanıcı giriş
router.post("/login", login);

module.exports = router;
