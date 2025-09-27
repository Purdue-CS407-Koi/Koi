import React, { useState } from "react";

interface AddGroupExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseName: string) => void;
  groupName?: string;
  allGroups: string[];
}

export const AddGroupExpenseModal: React.FC<AddGroupExpenseModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  groupName = null,
  allGroups
}) => {
  const [expenseName, setExpenseName] = useState("");
  const [expenseDollars, setExpenseDollars] = useState('00');
  const [expenseCents, setExpensecents] = useState('00');
  const [group, setGroup] = useState(groupName);

  const [error, setError] = useState("");

  const handleSave = () => {
    if (!expenseName.trim()) {
      setError("Expense name is required");
      return;
    }

    onSave(expenseName.trim());
    handleClose();
  };

  const handleClose = () => {
    setExpenseName("");
    setError("");
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            width: "100%",
            maxWidth: "400px",
            margin: "16px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              Create New Expense For {groupName}
            </h3>
          </div>

          {/* Input */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Expense Name
            </label>
            <input
              type="text"
              value={expenseName}
              onChange={(e) => {
                setExpenseName(e.target.value);
                if (error) setError(""); // Clear error when user types
              }}
              onKeyDown={handleKeyPress}
              placeholder="Enter expense name"
              autoFocus
              style={{
                width: "100%",
                padding: "12px",
                border: error ? "2px solid #ef4444" : "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = error ? "#ef4444" : "#3b82f6";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = error ? "#ef4444" : "#e5e7eb";
              }}
            />
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Expense Amount
            </label>
            $<input
              type="text"
              value={expenseDollars}
              onChange={(e) => {
                setExpenseDollars(e.target.value);
                if (error) setError(""); // Clear error when user types
              }}
              onKeyDown={handleKeyPress}
              placeholder="00"
              style={{
                width: "20%",
                padding: "12px",
                border: error ? "2px solid #ef4444" : "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
                textAlign: "right",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = error ? "#ef4444" : "#3b82f6";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = error ? "#ef4444" : "#e5e7eb";
              }}
            />.
            <input
              type="text"
              value={expenseCents}
              onChange={(e) => {
                setExpensecents(e.target.value);
                if (error) setError(""); // Clear error when user types
              }}
              onKeyDown={handleKeyPress}
              placeholder="00"
              maxLength={2}
              style={{
                width: "calc(2em + 14px)",
                padding: "12px",
                border: error ? "2px solid #ef4444" : "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = error ? "#ef4444" : "#3b82f6";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = error ? "#ef4444" : "#e5e7eb";
              }}
            />
            {error && (
              <p
                style={{
                  margin: "8px 0 0 0",
                  fontSize: "12px",
                  color: "#ef4444",
                }}
              >
                {error}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={handleClose}
              style={{
                padding: "10px 20px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                backgroundColor: "white",
                color: "#374151",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f9fafb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              // disabled={!groupName.trim()}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                // backgroundColor: groupName.trim() ? "#3b82f6" : "#9ca3af",
                color: "white",
                fontSize: "14px",
                // cursor: groupName.trim() ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                // if (groupName.trim()) {
                //   e.currentTarget.style.backgroundColor = "#2563eb";
                // }
              }}
              onMouseLeave={(e) => {
                // if (groupName.trim()) {
                //   e.currentTarget.style.backgroundColor = "#3b82f6";
                // }
              }}
            >
              Create Expense
            </button>
          </div>
        </div>
      </div>
    </>
  );
};