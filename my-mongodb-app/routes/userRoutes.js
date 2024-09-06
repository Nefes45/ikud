const express = require("express");
const {
  registerUser,
  loginUser,
  getUsers,
} = require("../controllers/userController");
const router = express.Router();

// Kullanıcı kayıt
router.post("/register", registerUser);

// Kullanıcı girişi
router.post("/login", loginUser);

// Tüm kullanıcıları getirme
router.get("/", getUsers);

module.exports = router;
