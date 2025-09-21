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
    <div style={{ marginBottom: "1rem", width: "100%" }}>
      <label
        style={{
          display: "block",
          fontSize: "0.875rem",
          fontWeight: "500",
          marginBottom: "0.5rem",
          textAlign: "left",
          color: "#374151", // Gray-700 for label
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          backgroundColor: "white",
          border: "1px solid #d1d5db",
          borderRadius: "0.375rem",
          fontSize: "1rem",
          outline: "none",
          transition: "all 0.2s ease-in-out",
          color: "#111827",
          cursor: "text",
          lineHeight: "1.5",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#3b82f6";
          e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#d1d5db";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
};