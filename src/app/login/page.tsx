'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";
import InputField from "../components/InputField";
import { v4 as uuidv4 } from 'uuid';

export default function Login() {
  // Estado para manejar el correo, errores, y la carga
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Función para obtener o generar un deviceId único
  const getDeviceId = (): string => {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
  };

  // Manejo del formulario de inicio de sesión
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const deviceId = getDeviceId();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, deviceId }),
      });

      if (response.ok) {
        const { token, logoutToken } = await response.json();
        
        // Guardar los tokens en localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("logoutToken", logoutToken);

        // Verificar si los tokens se guardaron correctamente
        console.log("Token guardado:", localStorage.getItem("token"));
        console.log("LogoutToken guardado:", localStorage.getItem("logoutToken"));

        const { role } = JSON.parse(atob(token.split(".")[1]));

        if (role === "admin") {
          setError("Favor de verificar su correo.");
          localStorage.removeItem("token");
          localStorage.removeItem("logoutToken");
        } else {
          router.push("/live");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error de autenticación");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError("Error al conectar con el servidor: " + err.message);
      } else {
        setError("Error desconocido al conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-[#006FCF] via-[#00175A] to-[#006FCF]">
      <img
        src="/gbtwhite.svg"
        alt="American Express Logo"
        width={120}
        height={40}
        className="mb-8"
      />
      <div className="p-8 max-w-sm w-full bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-blue-600 text-center">
          Iniciar Sesión
        </h1>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            type="email"
            placeholder="Correo"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mode="register"
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
        {loading && <Loader />}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <button
              onClick={() => router.push("/registro")}
              className="text-blue-600 hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
        <div className="mt-4 text-center absolute left-8 top-7">
          <button
            onClick={() => router.back()}
            className="text-sm text-white hover:underline"
          >
            &larr; Volver
          </button>
        </div>
      </div>
    </div>
  );
}

