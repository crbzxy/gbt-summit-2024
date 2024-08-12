import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { logoutToken } = await request.json();
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !logoutToken) {
      return NextResponse.json(
        { message: "Token de salida y autorización requeridos." },
        { status: 400 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decodedToken: JwtPayload;

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (error) {
      return NextResponse.json({ message: "Token no válido." }, { status: 401 });
    }

    if (!decodedToken?.userId) {
      return NextResponse.json({ message: "Token no válido." }, { status: 401 });
    }

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado." }, { status: 404 });
    }

    // Verifica si el token de logout coincide
    if (user.logoutToken !== logoutToken) {
      console.error('Logout token no coincide:', {
        expected: user.logoutToken,
        received: logoutToken,
      });
      return NextResponse.json({ message: "Token de salida no válido." }, { status: 401 });
    }

    // Invalida la sesión actual y todos los dispositivos asociados
    user.sessionToken = undefined;
    user.deviceId = undefined;
    user.logoutToken = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Sesión cerrada con éxito." },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en el cierre de sesión:', error);
    return NextResponse.json(
      { message: "Error en el cierre de sesión.", error: (error as Error).message },
      { status: 500 }
    );
  }
}
