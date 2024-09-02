const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Çevresel değişkenleri yükle
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Veritabanı bağlantısı
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB'ye başarıyla bağlandı"))
  .catch((err) => console.error("MongoDB bağlantı hatası: ", err));

// Rotalar
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));
