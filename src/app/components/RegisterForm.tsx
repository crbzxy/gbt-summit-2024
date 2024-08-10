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

  const { countries, loading: countriesLoading, error: countriesError } = useCountries();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, phone, company, position, country } = formData;
    if (!name || !email || !phone || !company || !position || !country) {
      setError("Por favor, completa todos los campos.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
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

  const sortedCountries = countries
    ? countries.sort((a, b) => {
        if (a.code === "MX") return -1;
        if (b.code === "MX") return 1;
        return a.name.localeCompare(b.name);
      })
    : [];

  const buttonText = mode === "register" ? "Registrar" : "Guardar Cambios";
  const backgroundClass = mode === "edit" ? "bg-white" : "bg-gradient-to-tr from-[#006FCF] via-[#00175A] to-[#006FCF]";
  const textClass = mode === "edit" ? "text-black" : "text-white";

  return (
    <div id="registro" className={`min-h-screen flex items-center justify-center ${backgroundClass}`}>
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
          <h1 className={`text-3xl font-bold mb-6 ${textClass} text-left`}>
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
              mode={mode}
            />
            <InputField
              type="email"
              placeholder="Correo"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              mode={mode}
            />
            <InputField
              type="text"
              placeholder="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              mode={mode}
            />
            <InputField
              type="text"
              placeholder="Empresa"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              mode={mode}
            />
            <InputField
              type="text"
              placeholder="Puesto"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              mode={mode}
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
                {sortedCountries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            )}
            <button
              type="submit"
              className={`w-full p-3 ${
                mode === "edit" ? "bg-blue-500 text-white" : "bg-blue-200 text-blue-900"
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
