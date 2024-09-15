import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { formatInTimeZone, toDate } from 'date-fns-tz';
import { addHours, isAfter } from "date-fns";

function getMexicoCityTime() {
  return formatInTimeZone(new Date(), 'America/Mexico_City', "yyyy-MM-dd'T'HH:mm:ssXXX");
}

export async function POST(request: Request) {
  await dbConnect();

  const { email } = await request.json();
  console.log("Datos recibidos:", { email });

  if (!email) {
    return NextResponse.json({ message: "El correo electrónico es requerido." }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email });
    console.log("Usuario encontrado:", user ? "Sí" : "No");

    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado." }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ message: "JWT Secret no definido." }, { status: 500 });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, secret, {
      expiresIn: "6h",
    });

    const currentMexicoTime = getMexicoCityTime();
    const sessionExpirationLimit = toDate(formatInTimeZone(new Date("2024-09-26T13:00:00Z"), 'America/Mexico_City', "yyyy-MM-dd'T'HH:mm:ssXXX"));
    let sessionExpiresAt = toDate(formatInTimeZone(addHours(new Date(), 6), 'America/Mexico_City', "yyyy-MM-dd'T'HH:mm:ssXXX"));

    if (isAfter(sessionExpiresAt, sessionExpirationLimit)) {
      sessionExpiresAt = sessionExpirationLimit;
    }

    user.sessionToken = token;
    user.sessionExpiresAt = sessionExpiresAt;
    user.sessionStartedAt = toDate(currentMexicoTime);
    user.lastActiveAt = toDate(currentMexicoTime);
    user.logoutToken = undefined;

    await user.save();

    console.log("Inicio de sesión exitoso. Campos actualizados y token generado.");
    console.log("Detalles de la sesión:", {
      sessionStartedAt: formatInTimeZone(user.sessionStartedAt, 'America/Mexico_City', "yyyy-MM-dd HH:mm:ss zzz"),
      sessionExpiresAt: formatInTimeZone(user.sessionExpiresAt, 'America/Mexico_City', "yyyy-MM-dd HH:mm:ss zzz"),
      lastActiveAt: formatInTimeZone(user.lastActiveAt, 'America/Mexico_City', "yyyy-MM-dd HH:mm:ss zzz")
    });

    // Incluir el `userId` y el `name` en la respuesta
    return NextResponse.json({ 
      message: "Inicio de sesión exitoso", 
      token, 
      userId: user._id, // Enviar el userId
      name: user.name // Asegúrate de que "user.name" está definido en tu esquema
    }, { status: 200 });

  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    return NextResponse.json({ message: "Error al iniciar sesión", error: (error as Error).message }, { status: 500 });
  }
}
