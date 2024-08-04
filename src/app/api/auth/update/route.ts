import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function PUT(request: Request) {
  await dbConnect();

  const { token, name, phone, company, position } = await request.json();

  if (!token) {
    return NextResponse.json({ message: 'Token requerido' }, { status: 400 });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ message: 'JWT Secret no definido' }, { status: 500 });
    }

    const decoded = jwt.verify(token, secret) as { userId: string };

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { name, phone, company, position },
      { new: true }
    );

    return NextResponse.json({ message: 'Usuario actualizado', user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al actualizar usuario', error }, { status: 500 });
  }
}
