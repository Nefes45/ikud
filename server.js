const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 5000;

// CORS'u detaylı bir şekilde yapılandırın
const corsOptions = {
  origin: "*", // Tüm kaynaklardan gelen isteklere izin verir
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // İzin verilen HTTP metodları
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions)); // CORS ayarlarını uygulayın
app.use(express.json());

const usersFilePath = path.join(__dirname, "users.json");

const readUsersFromFile = () => {
  const data = fs.readFileSync(usersFilePath, "utf8");
  return JSON.parse(data);
};

const writeUsersToFile = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Kullanıcı kaydetme
app.post("/api/register", (req, res) => {
  try {
    const users = readUsersFromFile();
    const newUser = req.body;
    newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
    users.push(newUser);
    writeUsersToFile(users);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Kullanıcı eklenirken hata oluştu" });
  }
});

// Tüm kullanıcıları getirme
app.get("/api/users", (req, res) => {
  try {
    const users = readUsersFromFile();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Kullanıcıları çekerken hata oluştu" });
  }
});

// Tek bir kullanıcıyı ID ile getirme
app.get("/api/users/:id", (req, res) => {
  try {
    const users = readUsersFromFile();
    const user = users.find((u) => u.id === parseInt(req.params.id, 10));
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Kullanıcıları çekerken hata oluştu" });
  }
});

// Kullanıcı güncelleme
app.put("/api/users/:id", (req, res) => {
  try {
    const users = readUsersFromFile();
    const userIndex = users.findIndex(
      (u) => u.id === parseInt(req.params.id, 10)
    );
    if (userIndex === -1) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }
    users[userIndex] = { ...users[userIndex], ...req.body };
    writeUsersToFile(users);
    res.json(users[userIndex]);
  } catch (err) {
    res.status(500).json({ error: "Kullanıcı güncellenirken hata oluştu" });
  }
});

// Kullanıcı silme
app.delete("/api/users/:id", (req, res) => {
  try {
    let users = readUsersFromFile();
    users = users.filter((u) => u.id !== parseInt(req.params.id, 10));
    writeUsersToFile(users);
    res.json({ message: "Kullanıcı başarıyla silindi" });
  } catch (err) {
    res.status(500).json({ error: "Kullanıcı silinirken hata oluştu" });
  }
});

// CORS preflight isteği ele alma
app.options("*", cors(corsOptions)); // CORS için preflight isteğini ele alır

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
