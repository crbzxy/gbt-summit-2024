import React, { ChangeEvent } from "react";

interface InputFieldProps {
  type: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  mode: "register" | "edit"; // Añadir esta línea
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholder,
  name,
  value,
  onChange,
  mode, // Añadir esta línea
}) => {
  return (
    <div className="relative mb-6">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`peer w-full px-3 py-2 my-1 border-2 bg-white border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-transparent transition h-12`}
        placeholder=" " // Placeholder vacío para activar el label flotante
        id={name} // Asegúrate de que el input tenga un id para el label
      />
      <label
        htmlFor={name}
        className={`absolute left-1 top-1/2 transform -translate-y-1/2  px-1 text-gray-500 transition-all duration-200 ease-in-out ${
          value || mode === "edit" ? "text-sm top-0 -translate-y-full scale-75 text-white" : ""
        } peer-focus:text-sm peer-focus:top-0 peer-focus:-translate-y-full peer-focus:scale-75 peer-focus:text-gray-400`}
      >
        {placeholder}
      </label>
    </div>
  );
};

export default InputField;
