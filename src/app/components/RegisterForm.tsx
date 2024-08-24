import React, { useState, useEffect } from "react";
import InputField from "@/app/components/InputField";
import useCountries from "@/app/hooks/useCountries";
import { v4 as uuidv4 } from "uuid"; // Importa uuid para generar tokens únicos

export type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  country: string;
  registrationType: string;
  password?: string;
  role?: string;
  logoutToken?: string; // Agrega el campo logoutToken
};

interface RegistrationFormProps {
  mode: "register" | "edit";
  initialData?: Partial<FormState>;
  onSubmit: (data: FormState) => Promise<void>;
  isAdmin?: boolean;
  // registrationType?: string;
}

const RegisterForm: React.FC<RegistrationFormProps> = ({
  mode,
  initialData = {},
  onSubmit,
  isAdmin = false,
}) => {
  const [showSelect, setShowSelect] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    name: initialData.name ?? "",
    email: initialData.email ?? "",
    phone: initialData.phone ?? "",
    company: initialData.company ?? "",
    position: initialData.position ?? "",
    country: initialData.country ?? "",
    registrationType: "presencial", // Valor por defecto
    password: "",
    role: isAdmin ? "admin" : "user",
  });

  useEffect(() => {
    const path = window.location.pathname + window.location.hash;

    if (path === "/" || path === "/#registro") {
      setShowSelect(false); // Mostrar el select si estamos en la ruta general o con hash #registro
    } else {
      let registrationType = "presencial"; // Valor por defecto para rutas generales

      if (path.includes("/p/registro")) {
        registrationType = "presencial";
      } else if (path.includes("/v/registro")) {
        registrationType = "virtual";
      }

      // Luego, establece el estado
      setFormData((prevData) => ({ ...prevData, registrationType }));

    }
  }, []);

  const { countries, loading: countriesLoading, error: countriesError } = useCountries();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const { name, email, phone, company, position, country, password } = formData;

    if (!name || !email || !phone || !company || !position || !country) {
      setError("Por favor, completa todos los campos.");
      return false;
    }

    if (isAdmin && !password) {
      setError("La contraseña es requerida para los administradores.");
      return false;
    }

    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value ?? "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    // Genera un logoutToken único
    const logoutToken = uuidv4();
    console.log("Logout token generado:", logoutToken);

    // Incluye el logoutToken en los datos enviados
    const dataToSubmit = { ...formData, logoutToken };
    if (!isAdmin || !formData.password || formData.password.trim() === "") {
      delete dataToSubmit.password;
    }

    try {
      await onSubmit(dataToSubmit);
    } catch (error: any) {
      setError(error.message || "Error desconocido.");
    } finally {
      setLoading(false);
    }
  };


  const getSortedCountries = () => {
    if (!countries) return [];
    return countries.sort((a, b) => {
      if (a.code === "MX") return -1;
      if (b.code === "MX") return 1;
      return a.name.localeCompare(b.name);
    });
  };

  const sortedCountries = getSortedCountries();

  const getButtonClass = (): string => {
    const baseClass = "w-full p-3 font-semibold rounded-xl transition-colors";
    const colorClass = mode === "edit" ? "text-blue bg-white" : "bg-[rgb(153,236,255)] text-[#1e2256]";
    const hoverClass = "hover:bg-blue-700 hover:text-white";
    const disabledClass = loading ? "opacity-50 cursor-not-allowed" : "";

    return `${baseClass} ${colorClass} ${hoverClass} ${disabledClass}`;
  };

  const buttonText = mode === "register" ? "Registrar" : "Guardar Cambios";
  const backgroundClass = mode === "edit" ? "bg-white" : "bg-gradient-to-tr from-[#006FCF] via-[#00175A] to-[#006FCF]";
  const textClass = mode === "edit" ? "text-black" : "text-white";

  const renderCountriesDropdown = () => {
    if (countriesLoading) return <p>Cargando países...</p>;
    if (countriesError) return <p>Error al cargar países: {countriesError}</p>;

    return (
      <select
        name="country"
        value={formData.country ?? ""}
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
    );
  };

  return (
    <div id="registro" className={`min-h-screen flex items-center justify-center ${backgroundClass}`}>
      <div className="flex flex-col md:flex-row items-center justify-center">
        {mode !== "edit" && (
          <div className="h-auto">
            <img
              src="/tarjeta.svg"
              alt="Tarjeta"
              className="w-[500px] h-4/6 rounded-lg min-w-[320px]"
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
              value={formData.name ?? ""}
              onChange={handleInputChange}
              mode={mode}
            />
            <InputField
              type="email"
              placeholder="Correo"
              name="email"
              value={formData.email ?? ""}
              onChange={handleInputChange}
              mode={mode}
            />
            <InputField
              type="text"
              placeholder="Teléfono"
              name="phone"
              value={formData.phone ?? ""}
              onChange={handleInputChange}
              mode={mode}
            />
            <InputField
              type="text"
              placeholder="Empresa"
              name="company"
              value={formData.company ?? ""}
              onChange={handleInputChange}
              mode={mode}
            />
            <InputField
              type="text"
              placeholder="Puesto"
              name="position"
              value={formData.position ?? ""}
              onChange={handleInputChange}
              mode={mode}
            />

            {renderCountriesDropdown()}

            {showSelect && (
              <select
                name="registrationType"
                value={formData.registrationType}
                onChange={handleInputChange}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg"
              >
                <option value="virtual">Virtual</option>
                <option value="presencial">Presencial</option>
              </select>
            )}

            {isAdmin && (
              <InputField
                type="password"
                placeholder="Contraseña"
                name="password"
                value={formData.password ?? ""}
                onChange={handleInputChange}
                mode={mode}
              />
            )}
            <button
              type="submit"
              className={getButtonClass()}
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
