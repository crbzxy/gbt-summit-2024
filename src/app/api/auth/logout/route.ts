import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(request: Request) {
  await dbConnect();

  const { logoutToken } = await request.json();
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !logoutToken) {
    return NextResponse.json({ message: "Token de salida y autorización requeridos." }, { status: 400 });
  }

  const token = authHeader.split(" ")[1];
  let decodedToken: JwtPayload | string;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return NextResponse.json({ message: "Token no válido." }, { status: 401 });
  }

  // Aquí ya sabemos que decodedToken es de tipo JwtPayload, por lo tanto, no se necesita la aserción
  if (typeof decodedToken === "string" || !("userId" in decodedToken)) {
    return NextResponse.json({ message: "Token no válido." }, { status: 401 });
  }

  const user = await User.findById(decodedToken.userId);

  if (!user || user.logoutToken !== logoutToken) {
    return NextResponse.json({ message: "Token de salida no válido." }, { status: 401 });
  }

  // Invalida la sesión actual y todos los dispositivos asociados
  user.sessionToken = undefined;
  user.deviceId = undefined;
  user.logoutToken = undefined;
  await user.save();

  return NextResponse.json({ message: "Sesión cerrada con éxito." }, { status: 200 });
}
