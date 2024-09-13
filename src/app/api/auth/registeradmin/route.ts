import { NextResponse } from 'next/server';
import {dbConnect} from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request: Request) {
  console.log("Iniciando proceso de registro de administrador");
  await dbConnect();

  try {
    const body = await request.json();
    console.log("Datos recibidos:", JSON.stringify(body, null, 2));

    const { name, email, phone, company, position, country, registrationType, password, role } = body;

    console.log("Validando campos requeridos");
    if (!name || !email || !phone || !company || !position || !country || !password || !role) {
      console.log("Faltan datos requeridos");
      return NextResponse.json({ message: 'Faltan datos, favor de verificar.' }, { status: 400 });
    }

    console.log("Verificando si el usuario ya existe");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Usuario ya existe con este email:", email);
      return NextResponse.json({ message: 'El correo electrónico ya está registrado.' }, { status: 409 });
    }

    console.log("Creando nuevo usuario");
    const user = new User({
      name,
      email,
      phone,
      company,
      position,
      country,
      registrationType: registrationType || 'general',
      password,
      role: role === 'admin' ? 'admin' : 'user',
    });

    console.log("Guardando usuario en la base de datos");
    await user.save();

    console.log("Usuario guardado exitosamente");
    const userResponse = { ...user.toObject(), password: undefined };
    console.log("Respuesta a enviar:", JSON.stringify(userResponse, null, 2));

    return NextResponse.json({ message: 'Usuario registrado con éxito.', user: userResponse }, { status: 201 });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json({ message: 'Error al registrar usuario.', error: (error as Error).message }, { status: 500 });
  }
}