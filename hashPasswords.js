const bcrypt = require("bcrypt");
const connection = require("./config/db"); // Veritabanı bağlantınızın olduğu dosya

// Tüm kullanıcıları çek
connection.query("SELECT * FROM users", async (err, results) => {
  if (err) {
    console.error("Veritabanı hatası:", err);
    return;
  }

  for (const user of results) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Hashlenmiş şifreyi güncelle
    connection.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, user.id],
      (err, updateResult) => {
        if (err) {
          console.error("Şifre güncellenemedi:", err);
        } else {
          console.log(`Kullanıcı ${user.id} için şifre güncellendi.`);
        }
      }
    );
  }
});
