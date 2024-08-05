import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request: Request) {
  await dbConnect();

  // Solo requerimos el email
  const { email } = await request.json();

  // Verificar que el correo esté presente
  if (!email) {
    return NextResponse.json({ message: 'El correo electrónico es requerido.' }, { status: 400 });
  }

  try {
    // Verificar si el usuario existe en la base de datos
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 401 });
    }

    // Generar un token JWT para el usuario
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ message: 'JWT Secret no definido' }, { status: 500 });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, secret, {
      expiresIn: '1h',
    });

    // Actualizar el sessionToken en la base de datos si es necesario
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
