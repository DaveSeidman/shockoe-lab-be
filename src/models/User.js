const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true }, // Should be hashed before saving
  role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
});

module.exports = mongoose.model('User', userSchema);
