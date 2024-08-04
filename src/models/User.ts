import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  position: { type: String },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  registrationType: { type: String, enum: ['website', 'presencial', 'remoto'], default: 'website' },
  sessionToken: { type: String },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
