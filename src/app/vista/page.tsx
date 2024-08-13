"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";
import InputField from "../components/InputField";

export default function Vista() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
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

  // Redirige al usuario a la página de registro
  const handleRegisterRedirect = () => {
    router.push("/registro");
  };

  // Regresa a la pantalla anterior
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-700 via-blue-950 to-indigo-700">
      <img
        src="/gbtwhite.svg"
        alt="American Express Logo"
        width={120}
        height={40}
        className="mb-8"
      />
    </div>
  );
}
