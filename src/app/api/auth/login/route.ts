import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/dbConnect";
import User from "../../../../models/User";
import { addHours, isAfter } from "date-fns";
import { formatInTimeZone, toDate } from 'date-fns-tz';

const MEXICO_TIMEZONE = 'America/Mexico_City';

function getMexicoCityTime() {
  return formatInTimeZone(new Date(), MEXICO_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

export async function POST(request: Request) {
  await dbConnect();

  const { email } = await request.json();

  if (!email) {
    return NextResponse.json(
      {
        message: "El correo electrónico es requerido.",
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

    const now = getMexicoCityTime();
    const sessionExpirationLimit = toDate(formatInTimeZone(new Date("2024-09-26T13:00:00Z"), MEXICO_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX"));
    let sessionExpiresAt = toDate(formatInTimeZone(addHours(new Date(), 4), MEXICO_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX"));

    if (isAfter(sessionExpiresAt, sessionExpirationLimit)) {
      sessionExpiresAt = sessionExpirationLimit;
    }

    user.sessionToken = token;
    user.sessionExpiresAt = sessionExpiresAt;
    user.lastActiveAt = toDate(now);
    user.sessionStartedAt = toDate(now);
    user.logoutToken = undefined;

    await user.save();

    console.log("Inicio de sesión exitoso. Detalles de la sesión:", {
      sessionStartedAt: formatInTimeZone(user.sessionStartedAt, MEXICO_TIMEZONE, "yyyy-MM-dd HH:mm:ss zzz"),
      sessionExpiresAt: formatInTimeZone(user.sessionExpiresAt, MEXICO_TIMEZONE, "yyyy-MM-dd HH:mm:ss zzz"),
      lastActiveAt: formatInTimeZone(user.lastActiveAt, MEXICO_TIMEZONE, "yyyy-MM-dd HH:mm:ss zzz")
    });

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