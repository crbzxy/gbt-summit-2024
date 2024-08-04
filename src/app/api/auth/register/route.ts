import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request: Request) {
  await dbConnect();

  const { name, email, password, phone, company, position, registrationType } = await request.json();

  // Verificación de campos requeridos
  if (!name || !email || !password) {
    return NextResponse.json({ message: 'Faltan datos' }, { status: 400 });
  }

  try {
    // Verificar si el email ya existe en la base de datos
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'El correo electrónico ya está registrado' }, { status: 409 });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      company,
      position,
      registrationType: registrationType || 'home', // Establecer tipo de registro predeterminado
    });

    // Guardar el usuario en la base de datos
    await user.save();

    // Retornar una respuesta exitosa
    return NextResponse.json({ message: 'Usuario registrado con éxito', user }, { status: 201 });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json({ message: 'Error al registrar usuario', error }, { status: 500 });
  }
}
 