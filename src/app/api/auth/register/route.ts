import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request: Request) {
  await dbConnect();

  const { name, email, password, phone, company, position, registrationType } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ message: 'Faltan datos' }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      company,
      position,
      registrationType: registrationType || 'home', // Establecer tipo de registro predeterminado
    });

    await user.save();

    return NextResponse.json({ message: 'Usuario registrado', user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al registrar usuario', error }, { status: 500 });
  }
}
