const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/myDatabase",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB bağlantısı başarılı.");
  } catch (err) {
    console.error("MongoDB bağlantısı başarısız:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
