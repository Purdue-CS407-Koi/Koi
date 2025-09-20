// components/AuthInput.tsx
import React from "react";

interface AuthInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="flex flex-col items-start mb-4 w-full">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
      />
    </div>
  );
};
