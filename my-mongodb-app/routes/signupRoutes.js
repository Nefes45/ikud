const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const newUser = req.body;

  // Bu verileri bir veritabanına kaydedebilir veya admin'e incelemesi için başka bir yere gönderebilirsiniz
  console.log("Yeni kullanıcı başvurusu alındı:", newUser);

  // Yanıt olarak bir mesaj döndürün
  res.status(200).json({ message: "Başvurunuz alındı." });
});

module.exports = router;
