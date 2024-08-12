"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";
import InputField from "../components/InputField";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Nuevo estado para la contraseña
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario ya está autenticado como admin
    const token = localStorage.getItem("token");
    if (token) {
      const { role } = JSON.parse(atob(token.split(".")[1]));
      if (role === "admin") {
        router.push("/admin");
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/loginadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),  // Aquí password debe ser el texto claro
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);

        const { role } = JSON.parse(atob(token.split(".")[1]));

        if (role === "admin") {
          router.push("/admin");
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
        setError("Error al conectar con el servidor");
      }
      console.error("Error al conectar con el servidor", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/admin"); // Redirigir a la página de registro de administradores
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-[#006FCF] via-[#00175A] to-[#006FCF]">
      <img
        src="/gbtwhite.png"
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
          <InputField
            type="password"
            placeholder="Contraseña"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
              onClick={handleRegisterRedirect}
              className="text-blue-600 hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
        <div className="mt-4 text-center absolute left-8 top-7">
          <button
            onClick={handleBack}
            className="text-sm text-white hover:underline"
          >
            &larr; Volver
          </button>
          <p className="text-center "> Admin mode</p>
        </div>
      </div>
    </div>
  );
}
