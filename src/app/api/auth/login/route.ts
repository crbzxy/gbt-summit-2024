import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { addHours, isAfter } from "date-fns";

export async function POST(request: Request) {
  await dbConnect();

  const { email, deviceId } = await request.json();

  if (!email || !deviceId) {
    return NextResponse.json(
      {
        message: "El correo electrónico y el ID del dispositivo son requeridos.",
      },
      { status: 400 }
    );
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 401 }
      );
    }

    // Verificar si el dispositivo ya está registrado para este usuario
    if (user.deviceId && user.deviceId !== deviceId && user.sessionToken) {
      // Invalida la sesión actual si se intenta iniciar desde un dispositivo diferente
      return NextResponse.json(
        {
          message:
            "Sesión iniciada en otro dispositivo. Cierre la sesión actual para continuar.",
        },
        { status: 409 }
      );
    }

    // Generar un nuevo token JWT con una expiración de 4 horas
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { message: "JWT Secret no definido" },
        { status: 500 }
      );
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, secret, {
      expiresIn: "4h",
    });

    // Calcular la fecha de expiración de la sesión
    const now = new Date();
    const sessionExpirationLimit = new Date("2024-09-26T13:00:00Z"); // 1pm UTC
    let sessionExpiresAt = addHours(now, 4);
    if (isAfter(sessionExpiresAt, sessionExpirationLimit)) {
      sessionExpiresAt = sessionExpirationLimit; // Forzar la expiración a las 1pm del 26 de septiembre de 2024
    }

    // Actualizar el token, la fecha de expiración de la sesión, el ID del dispositivo y la última actividad en la base de datos
    user.sessionToken = token;
    user.sessionExpiresAt = sessionExpiresAt;
    user.deviceId = deviceId;
    user.lastActiveAt = now;
    user.logoutToken = undefined; // Se permite un nuevo login eliminando el logoutToken
    await user.save();

    return NextResponse.json(
      { message: "Inicio de sesión exitoso", token },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error al iniciar sesión:", err.message);
      return NextResponse.json(
        { message: "Error al iniciar sesión", error: err.message },
        { status: 500 }
      );
    }
    console.error("Error desconocido al iniciar sesión");
    return NextResponse.json(
      { message: "Error desconocido al iniciar sesión" },
      { status: 500 }
    );
  }
}
