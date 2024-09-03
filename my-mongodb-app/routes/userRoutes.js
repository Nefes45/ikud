const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Kullanıcı kaydetme
router.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Kullanıcı eklenirken hata oluştu" });
  }
});

// Tüm kullanıcıları getirme
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Kullanıcıları çekerken hata oluştu" });
  }
});

// Tek bir kullanıcıyı ID ile getirme
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Kullanıcıları çekerken hata oluştu" });
  }
});

// Kullanıcı güncelleme
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Kullanıcı güncellenirken hata oluştu" });
  }
});

// Kullanıcı silme
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }
    res.json({ message: "Kullanıcı başarıyla silindi" });
  } catch (err) {
    res.status(500).json({ error: "Kullanıcı silinirken hata oluştu" });
  }
});

module.exports = router;
