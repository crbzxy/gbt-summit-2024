// RegisterForm.tsx
"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import InputField from "../components/InputField";

// Definimos y exportamos FormState
export type FormState = {
  name: string;
  email: string;
  password: string;
  phone: string;
  company: string;
  position: string;
  registrationType: string;
};

interface RegistrationFormProps {
  registrationType: string; // 'website', 'presencial', 'remoto'
  mode: "register" | "edit"; // Modo del formulario
  initialData?: Partial<FormState>; // Datos iniciales para el modo de edición
  onSubmit: (data: FormState) => Promise<void>; // Función para manejar el envío
}

const RegisterForm: React.FC<RegistrationFormProps> = ({
  registrationType,
  mode,
  initialData = {},
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FormState>({
    name: initialData.name ?? "",
    email: initialData.email ?? "",
    password: "",
    phone: initialData.phone ?? "",
    company: initialData.company ?? "",
    position: initialData.position ?? "",
    registrationType,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { name, email, password, phone, company, position } = formData;

    // Validación básica
    if (
      !name ||
      !email ||
      (!password && mode === "register") || // Solo requiere password en registro
      !phone ||
      !company ||
      !position
    ) {
      setError("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData); // Usa la función de envío proporcionada
    } catch (error: any) {
      setError(error.message || "Error desconocido."); // Captura el mensaje de error
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Extracción de la lógica ternaria a una variable
  const buttonText = mode === "register" ? "Registrarse" : "Guardar Cambios";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 max-w-md w-full bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          {mode === "register" ? "Registrarse" : "Editar Usuario"}
        </h1>
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded">
            {error} {/* Muestra el mensaje de error */}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            type="text"
            placeholder="Nombre"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <InputField
            type="email"
            placeholder="Correo"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <InputField
            type="password"
            placeholder="Contraseña"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            showToggle={true}
            showPassword={showPassword}
            toggleShowPassword={toggleShowPassword}
          />
          <InputField
            type="text"
            placeholder="Teléfono"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <InputField
            type="text"
            placeholder="Empresa"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
          />
          <InputField
            type="text"
            placeholder="Puesto"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className={`w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Guardando..." : buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
