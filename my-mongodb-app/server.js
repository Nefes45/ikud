require("dotenv").config(); // .env dosyasını yükler
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = process.env.PORT || 5001;

// Veritabanına bağlan
connectDB();

// CORS Konfigürasyonu
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // .env dosyasından frontend URL'yi alın
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Çerez ve kimlik doğrulaması için gerekli
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Güvenlik için Helmet kullanımı
app.use(helmet());

// Middleware
app.use(express.json()); // JSON body'yi okumak için gerekli middleware

// Kullanıcı rotalarını kullan
app.use("/api/users", userRoutes);

// Global Hata Yönetimi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Bir hata oluştu!");
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor.`);
});
