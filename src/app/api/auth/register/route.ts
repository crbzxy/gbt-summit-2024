import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';
import { v4 as uuidv4 } from 'uuid'; // Importa uuid para generar tokens únicos

export async function POST(request: Request) {
  await dbConnect();

  // Obtener los datos del cuerpo de la solicitud
  const { name, email, phone, company, position, country, registrationType } = await request.json();

  // Verificación de campos requeridos
  if (!name || !email || !phone || !company || !position || !country) {
    return NextResponse.json({ message: 'Faltan datos, favor de verificar.' }, { status: 400 });
  }

  try {
    // Verificar si el email ya existe en la base de datos
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'El correo electrónico ya está registrado.' }, { status: 409 });
    }

    // Generar un logoutToken único
    const logoutToken = uuidv4();

    // Crear un nuevo usuario con todos los campos inicializados
    const user = new User({
      name,
      email,
      phone,
      company,
      position,
      country,
      role: 'user', // Asignación del rol por defecto
      registrationType: registrationType || 'general', // Asignación del tipo de registro
      sessionToken: null, // Inicializar sin token
      sessionExpiresAt: null, // Sin fecha de expiración de sesión
      lastActiveAt: null, // Sin actividad inicial
      deviceId: null, // Sin dispositivo inicial
      logoutToken, // Asignación del logoutToken generado
    });

    // Guardar el usuario en la base de datos
    await user.save();

    // Retornar una respuesta exitosa
    return NextResponse.json({ message: 'Usuario registrado con éxito.', user }, { status: 201 });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json({ message: 'Error al registrar usuario.', error }, { status: 500 });
  }
}
