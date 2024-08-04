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
    <div className="relative">
      <input
        className={`peer w-full p-3 border-b-2 bg-transparent text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 transition-all ${
          value ? "border-blue-500" : "border-gray-300"
        }`}
        type={showToggle && showPassword ? "text" : type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
      <label
        htmlFor={name}
        className={`absolute left-0 -top-3.5 text-gray-600 transition-all duration-200 ease-in-out pointer-events-none ${
          value
            ? "text-sm text-blue-500"
            : "text-base top-3 text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-500"
        }`}
      >
        {placeholder}
      </label>
      {showToggle && toggleShowPassword && (
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 focus:outline-none"
        >
          {showPassword ? "Ocultar" : "Mostrar"}
        </button>
      )}
    </div>
  )
);

export default InputField;
