// remoto/register/page.tsx
"use client";

import React, { useState } from 'react';
import RegisterForm, { FormState } from "../components/RegisterForm";
import SuccessModal from '../components/SuccessModal';
import { useRouter } from 'next/navigation'; // Importa el hook de navegación

export default function RegisterRemotoPage() {
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter(); // Inicializa el router

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
        // Mostrar el modal de éxito
        setSuccessMessage("Usuario registrado con éxito");
        setShowModal(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error de registro");
      }
    } catch (error: any) {
      // Lanza el error para que el componente de registro pueda capturarlo
      throw error;
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Redirigir al usuario a la página de inicio de sesión
    router.push('/login');
  };

  return (
    <div id="registro">
      <RegisterForm
      
        registrationType="website"
        mode="register" // Asegúrate de establecer el modo como "register"
        onSubmit={handleFormSubmit} // Pasa la función onSubmit
      />
      <SuccessModal
        show={showModal}
        onClose={handleCloseModal}
        message={successMessage}
      />
    </div>
  );
}
