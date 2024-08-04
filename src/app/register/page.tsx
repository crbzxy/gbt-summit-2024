"use client";

import RegisterForm, { FormState } from "../components/RegisterForm"; // Importa FormState

export default function RegisterRemotoPage() {
  const handleFormSubmit = async (data: FormState) => {
    console.log("Datos del formulario:", data);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Usuario registrado con éxito");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error de registro");
      }
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <RegisterForm
      registrationType="remoto"
      mode="register" // Asegúrate de establecer el modo como "register"
      onSubmit={handleFormSubmit}
    />
  );
}
