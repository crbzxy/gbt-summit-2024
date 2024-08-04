import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request: Request) {
  await dbConnect();

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Faltan datos favor de verificar' }, { status: 400 });
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

    // Actualizar el sessionToken en la base de datos
    user.sessionToken = token;
    await user.save();

    return NextResponse.json({ message: 'Inicio de sesión exitoso', token }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error al iniciar sesión:', err.message);
      return NextResponse.json({ message: 'Error al iniciar sesión', error: err.message }, { status: 500 });
    }
    console.error('Error desconocido al iniciar sesión');
    return NextResponse.json({ message: 'Error desconocido al iniciar sesión' }, { status: 500 });
  }
}
