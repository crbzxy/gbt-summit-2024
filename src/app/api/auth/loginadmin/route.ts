import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  await dbConnect();

  const { email, password } = await request.json();
  console.log("Datos recibidos:", { email, password: password ? '[REDACTED]' : 'No proporcionada' });

  if (!email || !password) {
    return NextResponse.json({ message: 'Correo electrónico y contraseña son requeridos.' }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email });
    console.log("Usuario encontrado:", user ? 'Sí' : 'No');

    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ message: 'Acceso denegado. Solo los administradores pueden iniciar sesión.' }, { status: 403 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("¿Contraseña válida?", isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Contraseña incorrecta.' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ message: 'JWT Secret no definido.' }, { status: 500 });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, secret, {
      expiresIn: '1h',
    });

    user.sessionToken = token;
    await user.save();

    return NextResponse.json({ message: 'Inicio de sesión exitoso.', token }, { status: 200 });
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    return NextResponse.json({ message: 'Error al iniciar sesión.', error: (err as Error).message }, { status: 500 });
  }
}