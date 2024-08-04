import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request: Request) {
  await dbConnect();

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Faltan datos' }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Contraseña incorrecta' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ message: 'JWT Secret no definido' }, { status: 500 });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, secret, {
      expiresIn: '1h',
    });

    return NextResponse.json({ message: 'Inicio de sesión exitoso', token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al iniciar sesión', error }, { status: 500 });
  }
}
