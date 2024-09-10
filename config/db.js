const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Aifa2010.!", // Veritabanı şifreniz
  database: "users_db", // Veritabanı ismi
});

connection.connect((err) => {
  if (err) {
    console.error("Veritabanı bağlantı hatası:", err);
    return;
  }
  console.log("Veritabanına bağlanıldı.");
});

module.exports = connection;
