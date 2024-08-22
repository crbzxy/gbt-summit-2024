"use client"


import React, { useState } from 'react';
import RegisterForm, { FormState } from "../components/RegisterForm";
import SuccessModal from '../components/SuccessModal';
import { useRouter } from 'next/navigation';

export default function RegisterAdminPage() {
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleFormSubmit = async (data: FormState) => {
    console.log("Iniciando proceso de registro de administrador");
    console.log("Datos del formulario:", JSON.stringify(data, null, 2));
  
    try {
      const adminData = {
        ...data,
        role: "admin",
      };
  
      console.log("Datos preparados para enviar al backend:", JSON.stringify(adminData, null, 2));
  
      const response = await fetch("/api/auth/registeradmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      });
  
      console.log("Respuesta recibida del servidor - Status:", response.status);
  
      const responseData = await response.json();
      console.log("Datos de respuesta del servidor:", JSON.stringify(responseData, null, 2));
  
      if (response.ok) {
        console.log("Registro exitoso");
        setSuccessMessage("Administrador registrado con éxito");
        setShowModal(true);
      } else {
        console.error("Error en la respuesta del servidor:", responseData.message);
        throw new Error(responseData.message || "Error de registro");
      }
    } catch (error: any) {
      console.error("Error al registrar administrador:", error.message);
      alert(error.message || "Ocurrió un error al registrar el administrador");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push('/vortex');
  };

  return (
    <div id="registro">
      <RegisterForm
        mode="register"
        onSubmit={handleFormSubmit}
        isAdmin={true}
      />
      <SuccessModal
        show={showModal}
        onClose={handleCloseModal}
        message={successMessage}
      />
    </div>
  );
}