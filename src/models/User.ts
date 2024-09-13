import mongoose, { CallbackError, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  country: string;
  role: string;
  registrationType: string;
  sessionToken?: string;
  sessionExpiresAt?: Date;
  sessionStartedAt?: Date; // Añadir este campo para almacenar el inicio de la sesión
  lastActiveAt?: Date;
  deviceId?: string;
  logoutToken?: string; // Token para controlar el logout
  password?: string;

  comparePassword(password: string): Promise<boolean>; // Método para comparar contraseñas
  isSessionValid(): boolean; // Método para validar la sesión
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  company: { type: String },
  position: { type: String },
  country: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  registrationType: { type: String, enum: ['general', 'presencial', 'virtual'], default: 'general' },
  sessionToken: { type: String },
  sessionExpiresAt: { type: Date },  // Fecha de expiración de la sesión
  sessionStartedAt: { type: Date },  // Fecha de inicio de la sesión
  lastActiveAt: { type: Date },  // Fecha de última actividad
  deviceId: { type: String },  // ID del dispositivo
  logoutToken: { type: String }, // Token de salida para validar el cierre de sesión
  password: { type: String },  // Campo para la contraseña
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function (next: (err?: CallbackError) => void) {
  const user = this as IUser;

  // Si no hay contraseña o no se ha modificado, continuar
  if (!user.password || !user.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

// Método para verificar la contraseña
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  const user = this as IUser;
  return bcrypt.compare(password, user.password!);
};

// Método para verificar la validez del token de sesión
userSchema.methods.isSessionValid = function (): boolean {
  const user = this as IUser;
  if (!user.sessionExpiresAt) return false;
  return new Date() < user.sessionExpiresAt;
};

userSchema.methods.updateLastActive = function () {
  const user = this as IUser;
  user.lastActiveAt = new Date();
  return user.save();
};

// Middleware que actualiza la última actividad antes de guardar
userSchema.pre('save', function (next: (err?: CallbackError) => void) {
  const user = this as IUser;
  if (user.isModified()) {
    user.lastActiveAt = new Date();
  }
  next();
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
