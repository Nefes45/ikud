const express = require("express");
const cors = require("cors");
const db = require("./config/db"); // Veritabanı bağlantısı
const bcrypt = require("bcrypt"); // Şifre hash çözme işlemleri için
const jwt = require("jsonwebtoken"); // JWT oluşturmak için
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Kullanıcıları çekmek için API endpoint
app.get("/api/users", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Kullanıcıları çekerken hata oluştu:", err);
      return res.status(500).json({ error: "Kullanıcılar çekilemedi." });
    }
    res.json(results); // Kullanıcıları JSON formatında gönderiyoruz
  });
});

// Kullanıcı giriş işlemi için API endpoint
app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email ve şifre gereklidir." });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Veritabanı hatası." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Yanlış şifre." });
    }

    const token = jwt.sign({ id: user.id }, "secret_key", { expiresIn: "1h" });
    res.json({ token, user });
  });
});

// Yeni kullanıcı ekleme işlemi
app.post("/api/users/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Tüm alanlar gereklidir." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Şifreyi hash'liyoruz
    const query =
      "INSERT INTO users (name, email, password, role, isActive) VALUES (?, ?, ?, ?, ?)";

    db.query(query, [name, email, hashedPassword, role, 1], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Kullanıcı eklenemedi." });
      }
      res.status(201).json({ message: "Kullanıcı başarıyla eklendi." });
    });
  } catch (error) {
    res.status(500).json({ error: "Bir hata oluştu." });
  }
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
