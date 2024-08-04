"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const router = useRouter();

  // Verificar la presencia del token al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Función de logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Eliminar el token de localStorage
    router.push("/login"); // Redirigir al usuario a la página de inicio de sesión
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 max-w-lg w-full bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Bienvenido a la Página de Usuario
        </h1>
        <iframe
          src="https://example.com"
          title="Contenido externo"
          className="w-full h-96 border mb-6"
        ></iframe>
        <button
          onClick={handleLogout}
          className="w-full p-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
