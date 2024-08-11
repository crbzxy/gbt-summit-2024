import mongoose, { CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  company: { type: String },
  position: { type: String },
  country: { type: String, required: true }, // Campo para el país
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  registrationType: { type: String, enum: ['general', 'presencial', 'virtual'], default: 'general' },
  sessionToken: { type: String },
  password: { type: String, required: true }, // Campo para la contraseña
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function (next: (err?: CallbackError) => void) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as CallbackError); // Asegura que el error sea del tipo correcto
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
