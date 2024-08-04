import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded = jwt.verify(token, secret) as { userId: string, role: string };
    request.headers.set('userId', decoded.userId);
    request.headers.set('role', decoded.role);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
