import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';

export async function GET(request: Request) {
  await dbConnect();

  // Obtener el token del encabezado de autorización
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return NextResponse.json({ message: 'JWT Secret no definido' }, { status: 500 });
  }

  try {
    const decoded = jwt.verify(token, secret) as { userId: string; role: string };

    // Verificar el rol del usuario
    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
    }

    // Obtener los usuarios de la base de datos
    const users = await User.find();
    return NextResponse.json({ users }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error al verificar el token:', err.message);
      return NextResponse.json({ message: 'Token inválido o expirado' }, { status: 401 });
    }
    console.error('Error desconocido al verificar el token');
    return NextResponse.json({ message: 'Error desconocido al verificar el token' }, { status: 500 });
  }
}
