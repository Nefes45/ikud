const express = require("express");
const {
  loginUser,
  addUser,
  fetchUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// Giriş işlemi
router.post("/login", loginUser);

// Yeni kullanıcı ekleme
router.post("/register", addUser);

// Tüm kullanıcıları getirme
router.get("/", fetchUsers);

// Kullanıcı güncelleme
router.put("/update/:id", updateUser);

// Kullanıcıyı silme
router.delete("/:id", deleteUser);

module.exports = router;
