import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';

export async function middleware(request: NextRequest) {
  // Obtener el token desde las cookies o el header Authorization
  const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=NoTokenProvided', request.url));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT Secret no está definido en el entorno.');
      return NextResponse.redirect(new URL('/login?error=ServerConfig', request.url));
    }

    // Verificar el token y manejar el tipo correctamente
    const decoded = jwt.verify(token, secret) as JwtPayload | null;

    if (!decoded || typeof decoded !== 'object' || !('userId' in decoded) || !('role' in decoded)) {
      return NextResponse.redirect(new URL('/login?error=InvalidToken', request.url));
    }

    const { userId } = decoded as { userId: string; role: string };

    // Conectar a la base de datos y verificar el token
    await dbConnect();
    const user = await User.findById(userId);

    if (!user || user.sessionToken !== token) {
      return NextResponse.redirect(new URL('/login?error=InvalidSession', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return NextResponse.redirect(new URL('/login?error=InvalidToken', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/live/:path*'], // Rutas protegidas
};
