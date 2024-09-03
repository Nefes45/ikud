const express = require("express");
const connectDB = require("./connectDB");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Veritabanı bağlantısı
connectDB();

// Middleware
app.use(express.json());

// Rotalar
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
});
