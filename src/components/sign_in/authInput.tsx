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
    <div className="mb-4 w-full">
      <label className="block text-sm font-medium mb-2 text-left text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full py-3 px-4 rounded-md outline-none cursor-text
          text-base leading-6
          bg-white text-auth-input-label
          border border-auth-input-border hover:border-auth-input-border-hover
          transition-all duration-200 ease-in-out
          hover:shadow-[0 0 0 2px rgba(59, 130, 246, 0.1)]
        `}
      />
    </div>
  );
};