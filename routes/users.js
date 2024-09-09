const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../config/db");

// Kullanıcı giriş işlemi (Login)
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email ve şifre gereklidir." });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Veritabanı hatası." });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Kullanıcı bulunamadı." });
      }

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(400).json({ error: "Geçersiz şifre." });
      }

      const token = jwt.sign({ id: user.id }, "secret_key", {
        expiresIn: "1h",
      });
      return res.json({ token, user });
    }
  );
});

// Yeni kullanıcı ekleme
router.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name, email, password, role, isActive) VALUES (?, ?, ?, ?, ?)",
    [name, email, hashedPassword, role, 1],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Kullanıcı eklenemedi." });
      }
      res.status(201).json({ message: "Kullanıcı başarıyla eklendi." });
    }
  );
});

module.exports = router;
