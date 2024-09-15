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
  sessionStartedAt?: Date;
  lastActiveAt?: Date;
  deviceId?: string;
  logoutToken?: string;
  password?: string;

  comparePassword(password: string): Promise<boolean>;
  isSessionValid(): boolean;
  updateLastActive(): Promise<void>;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/ },
  phone: { type: String },
  company: { type: String },
  position: { type: String },
  country: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  registrationType: { type: String, enum: ['general', 'presencial', 'virtual'], default: 'general' },
  sessionToken: { type: String },
  sessionExpiresAt: { type: Date },
  sessionStartedAt: { type: Date },
  lastActiveAt: { type: Date },
  deviceId: { type: String },
  logoutToken: { type: String },
  password: { type: String },
});

// Middleware para encriptar la contraseña antes de guardar y actualizar la última actividad
userSchema.pre('save', async function (next: (err?: CallbackError) => void) {
  const user = this as IUser;

  try {
    // Si la contraseña fue modificada, la encriptamos
    if (user.password && user.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }

    // Actualizamos la última actividad
    if (user.isModified()) {
      user.lastActiveAt = new Date();
    }

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

// Método para actualizar la última actividad
userSchema.methods.updateLastActive = async function (): Promise<void> {
  const user = this as IUser;
  user.lastActiveAt = new Date();
  await user.save();
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
