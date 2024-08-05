import React, { ChangeEvent, memo } from "react";

interface InputFieldProps {
  type: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  showToggle?: boolean;
  showPassword?: boolean;
  toggleShowPassword?: () => void;
}

const InputField: React.FC<InputFieldProps> = memo(
  ({
    type,
    placeholder,
    name,
    value,
    onChange,
    showToggle = false,
    showPassword,
    toggleShowPassword,
  }) => (
    <div className="relative mb-4">
      <input
        className={`peer w-full p-2 border-2 border-gray-300 rounded-lg bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
          value ? "ring-2 ring-blue-500" : ""
        }`}
        type={showToggle && showPassword ? "text" : type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
      
      {showToggle && toggleShowPassword && (
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-blue-800 focus:outline-none"
        >
          {showPassword ? "Ocultar" : "Mostrar"}
        </button>
      )}
    </div>
  )
);

// Define el displayName para el componente memoizado
InputField.displayName = "InputField";

export default InputField;
