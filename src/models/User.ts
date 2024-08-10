import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  company: { type: String },
  position: { type: String },
  country: { type: String, required: true }, // Nuevo campo para el país
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  registrationType: { type: String, enum: ['general', 'presencial', 'virtual'], default: 'general' },
  sessionToken: { type: String },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
