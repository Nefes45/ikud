const User = require("../models/User");
const jwt = require("jsonwebtoken");

// JWT token oluşturma
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Kullanıcı kaydetme
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "Bu e-posta zaten kayıtlı." });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser._id),
    });
  } catch (err) {
    res.status(500).json({ error: "Kullanıcı eklenirken hata oluştu." });
  }
};

// Kullanıcı girişi
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Geçersiz giriş bilgileri" });
    }
  } catch (error) {
    res.status(500).json({ message: "Giriş sırasında hata oluştu." });
  }
};

// Tüm kullanıcıları getirme
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Kullanıcıları çekerken hata oluştu." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
};
