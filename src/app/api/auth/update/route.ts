import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';

export async function PUT(request: Request) {
  await dbConnect();

  const { token, userId, name, email, phone, company, position, registrationType, password } = await request.json();

  if (!token) {
    return NextResponse.json({ message: 'Token requerido' }, { status: 400 });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ message: 'JWT Secret no definido' }, { status: 500 });
    }

    const decoded = jwt.verify(token, secret) as { userId: string, role: string };

    // Verificar si el usuario es administrador
    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 });
    }

    // Crear un objeto para las actualizaciones
    const updateData: Partial<{ name: string; email: string; password?: string; phone: string; company: string; position: string; registrationType: string; }> = { name, email, phone, company, position, registrationType };

    // Si se proporciona una nueva contraseña, hash y actualiza
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Usuario actualizado', user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json({ message: 'Error al actualizar usuario', error }, { status: 500 });
  }
}
