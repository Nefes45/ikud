const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["Admin", "Moderatör", "Kullanıcı"],
    default: "Kullanıcı",
  },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
