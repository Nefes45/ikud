const express = require("express");
const {
  loginUser,
  addUser,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();

// Giriş işlemi
router.post("/login", loginUser);

// Kullanıcı ekleme
router.post("/add", addUser);

// Kullanıcı silme
router.delete("/delete/:id", deleteUser);

module.exports = router;
