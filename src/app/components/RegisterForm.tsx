"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import InputField from "../components/InputField";
import useCountries from "../hooks/useCountries";

export type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  country: string;
  registrationType: string;
};

interface RegistrationFormProps {
  registrationType: string;
  mode: "register" | "edit";
  initialData?: Partial<FormState>;
  onSubmit: (data: FormState) => Promise<void>;
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
    phone: initialData.phone ?? "",
    company: initialData.company ?? "",
    position: initialData.position ?? "",
    country: initialData.country ?? "",
    registrationType,
  });

  const { countries, loading: countriesLoading, error: countriesError } =
    useCountries();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { name, email, phone, company, position, country } = formData;

    if (!name || !email || !phone || !company || !position || !country) {
      setError("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error: any) {
      setError(error.message || "Error desconocido.");
    } finally {
      setLoading(false);
    }
  };

  const buttonText = mode === "register" ? "Registrar" : "Guardar Cambios";

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        mode === "edit"
          ? "bg-white"
          : "bg-gradient-to-tr from-indigo-700 via-blue-950 to-indigo-700"
      }`}
    >
      <div className="flex flex-col md:flex-row">
        {mode !== "edit" && (
          <div className="h-auto">
            <img
              src="/tarjeta.png"
              alt="Tarjeta"
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
        <div className="p-8">
          <h1
            className={`text-3xl font-bold mb-6 ${
              mode === "edit" ? "text-black" : "text-white"
            } text-left`}
          >
            {mode === "register" ? "Registro" : "Editar Usuario"}
          </h1>
          {error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              type="text"
              placeholder="Nombre"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              mode={mode} // Pasar mode aquí
            />
            <InputField
              type="email"
              placeholder="Correo"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              mode={mode} // Pasar mode aquí
            />
            <InputField
              type="text"
              placeholder="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              mode={mode} // Pasar mode aquí
            />
            <InputField
              type="text"
              placeholder="Empresa"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              mode={mode} // Pasar mode aquí
            />
            <InputField
              type="text"
              placeholder="Puesto"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              mode={mode} // Pasar mode aquí
            />
            {countriesLoading ? (
              <p>Cargando países...</p>
            ) : countriesError ? (
              <p>Error al cargar países: {countriesError}</p>
            ) : (
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg"
              >
                <option value="">Seleccione un país</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            )}
            <button
              type="submit"
              className={`w-full p-3 ${
                mode === "edit"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-200 text-blue-900"
              } font-semibold rounded-xl hover:bg-blue-700 transition-colors hover:text-white ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Guardando..." : buttonText}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
