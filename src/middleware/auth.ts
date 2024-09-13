import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import {dbConnect} from '@/lib/dbConnect';;
import User from '../models/User';

export async function middleware(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    // Redirigir al login si no hay token
    return NextResponse.redirect(new URL('/login?error=NoTokenProvided', request.url));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT Secret no está definido en el entorno.');
      return NextResponse.redirect(new URL('/login?error=ServerConfig', request.url));
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, secret) as { userId: string; role: string };

    // Verificar si el token es válido en la base de datos
    await dbConnect();
    const user = await User.findById(decoded.userId);
    if (!user || user.sessionToken !== token) {
      // El token no coincide con el de la base de datos, redirigir al login
      return NextResponse.redirect(new URL('/login?error=InvalidSession', request.url));
    }

    return NextResponse.next(); // Continuar con la solicitud sin argumentos
  } catch (error) {
    console.error('Error al verificar el token:', error);
    // Redirigir al login con un mensaje de error
    return NextResponse.redirect(new URL('/login?error=InvalidToken', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/live/:path*'], // Rutas que requieren autenticación
};
