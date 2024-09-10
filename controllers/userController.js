const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../config/db");

// Kullanıcı giriş işlemi (Login)
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email ve şifre gereklidir." });
  }

  try {
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error("Veritabanı hatası:", err);
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

        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET || "secret_key",
          { expiresIn: "1h" }
        );

        return res.json({ token, user });
      }
    );
  } catch (error) {
    console.error("Login işlemi sırasında hata:", error);
    return res
      .status(500)
      .json({ error: "Login işlemi sırasında hata oluştu." });
  }
};

// Yeni kullanıcı ekleme işlemi
exports.addUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Tüm alanlar gereklidir." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role],
      (err, results) => {
        if (err) {
          console.error("Veritabanına eklenirken hata:", err);
          return res.status(500).json({ error: "Kullanıcı eklenemedi." });
        }
        res.status(201).json({ message: "Kullanıcı başarıyla eklendi." });
      }
    );
  } catch (error) {
    console.error("Kullanıcı ekleme işlemi sırasında hata:", error);
    return res
      .status(500)
      .json({ error: "Kullanıcı ekleme işlemi sırasında hata oluştu." });
  }
};

// Kullanıcı güncelleme işlemi
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Geçersiz kullanıcı ID'si." });
  }

  if (!name || !email || !role) {
    return res.status(400).json({ error: "İsim, e-posta ve rol gereklidir." });
  }

  try {
    let query = "UPDATE users SET username = ?, email = ?, role = ?";
    const params = [name, email, role];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ", password = ?";
      params.push(hashedPassword);
    }

    query += " WHERE id = ?";
    params.push(id);

    connection.query(query, params, (err, results) => {
      if (err) {
        console.error("Kullanıcı güncellenemedi:", err);
        return res.status(500).json({ error: "Kullanıcı güncellenemedi." });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Kullanıcı bulunamadı." });
      }

      res.json({ message: "Kullanıcı başarıyla güncellendi." });
    });
  } catch (error) {
    console.error("Kullanıcı güncellenirken hata:", error);
    return res
      .status(500)
      .json({ error: "Kullanıcı güncellenirken hata oluştu." });
  }
};

// Tüm kullanıcıları listeleme işlemi
exports.fetchUsers = (req, res) => {
  connection.query(
    "SELECT id, username AS name, email, role, isActive FROM users",
    (err, results) => {
      if (err) {
        console.error("Kullanıcılar çekilemedi:", err);
        return res.status(500).json({ error: "Kullanıcılar getirilemedi." });
      }
      res.json(results);
    }
  );
};

// Kullanıcıyı silme işlemi
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ error: "Geçerli bir kullanıcı ID'si sağlanmalıdır." });
  }

  connection.query("DELETE FROM users WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Kullanıcı silinemedi:", err);
      return res.status(500).json({ error: "Kullanıcı silinemedi." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    res.json({ message: "Kullanıcı başarıyla silindi." });
  });
};
