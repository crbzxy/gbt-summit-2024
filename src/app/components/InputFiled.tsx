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
                className={`w-full p-3 border ${value === "" ? "border-gray-300" : "border-blue-500"
                    } rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                    {showPassword ? "Ocultar" : "Mostrar"}
                </button>
            )}
        </div>
    )
);

export default InputField;
