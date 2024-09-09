const connection = require("../config/db");

// Kullanıcı giriş işlemi
exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";

  connection.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Veritabanı hatası" });
    }

    if (results.length > 0) {
      res.json({ user: results[0] });
    } else {
      res.status(401).json({ message: "Geçersiz e-posta veya şifre" });
    }
  });
};

// Yeni kullanıcı ekleme
exports.addUser = (req, res) => {
  const { name, email, password, role } = req.body;
  const query =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

  connection.query(query, [name, email, password, role], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Kullanıcı eklenemedi" });
    }

    res.status(201).json({ message: "Kullanıcı başarıyla eklendi" });
  });
};

// Kullanıcı silme
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Kullanıcı silinemedi" });
    }

    res.json({ message: "Kullanıcı başarıyla silindi" });
  });
};
