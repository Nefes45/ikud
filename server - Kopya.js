const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // CORS'u kullanabilmek için eklenmesi gerekli
const app = express();
const PORT = process.env.PORT || 5001;

// CORS ayarları
const corsOptions = {
  origin: ['https://stildunyasi.site', 'http://localhost:3000'], // Güvenli domainleri belirleyin
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// users.json dosyası için doğru yol
const usersFilePath = path.join(__dirname, 'public', 'users.json');

// Kullanıcıları JSON dosyasından okuma
const readUsersFromFile = () => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('users.json dosyası okunurken hata oluştu:', error);
    return [];
  }
};

// Kullanıcıları JSON dosyasına yazma
const writeUsersToFile = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('users.json dosyasına yazılırken hata oluştu:', error);
  }
};

// Sunucu başlatıldığında kullanıcıları yükle
let users = readUsersFromFile();

// Kullanıcıları listeleme API'si
app.get('/users', (req, res) => {
  res.json(users);
});

// Yeni kullanıcı ekleme API'si
app.post('/users', (req, res) => {
  const newUser = { ...req.body, id: users.length ? users[users.length - 1].id + 1 : 1 };
  users.push(newUser);
  writeUsersToFile(users);
  res.status(201).json(newUser);
});

// Kullanıcı silme API'si
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const initialLength = users.length;
  users = users.filter(user => user.id !== userId);
  if (users.length === initialLength) {
    return res.status(404).json({ error: 'User not found' });
  }
  writeUsersToFile(users);
  res.json({ message: 'User deleted successfully' });
});

// Statik dosyaları servis et
app.use(express.static(path.join(__dirname, 'build')));

// Tüm yolları yakala ve index.html döndür
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
