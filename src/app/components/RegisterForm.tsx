import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputFiled";

interface RegistrationFormProps {
  registrationType: string; // 'standard', 'presencial', 'remoto'
}

type FormState = {
  name: string;
  email: string;
  password: string;
  phone: string;
  company: string;
  position: string;
  registrationType: string;
};

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  registrationType,
}) => {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    phone: "",
    company: "",
    position: "",
    registrationType,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { name, email, password, phone, company, position } = formData;

    // Validación básica
    if (!name || !email || !password || !phone || !company || !position) {
      setError("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/login");
      } else {
        const errorData = await response.json();
        setError(
          errorData.message || "Error de registro, por favor intente de nuevo."
        );
      }
    } catch (error) {
      setError("Error al conectar con el servidor, intente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 max-w-md w-full bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Registrarse
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
            showToggle={true} // Añadimos la opción de mostrar/ocultar contraseña
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
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
