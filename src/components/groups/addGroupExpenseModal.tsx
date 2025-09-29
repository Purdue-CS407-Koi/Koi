import React, { useState } from "react";
import { BLACK, BUTTON_COLOR, BUTTON_HOVER_COLOR, TEXT_COLOR, WHITE } from  "../../config/colors";
import { TEXT_EDITING } from "../../config/keyboardEvents";
import { Dropdown } from "../general/dropdown";
import useGroups from "../../hooks/useGroups"

import { useUserStore } from "../../stores/useUserStore";

interface AddGroupExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseName: string) => void;
  group?: any;
}

export const AddGroupExpenseModal: React.FC<AddGroupExpenseModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  group = null,
}) => {
  const [expenseName, setExpenseName] = useState("");
  const [expenseDollars, setExpenseDollars] = useState('00');
  const [expenseCents, setExpenseCents] = useState('00');
  const [expenseDescription, setExpenseDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(group);
  const [members, setMembers] = useState<{name: string, id: string}[]>([]);
  const [payers, setPayers] = useState<{name: string, id: string}[]>([]);
  const [individualAmounts, setIndividualAmounts] = useState<{ [key: string]: {dollars: string, cents: string} }>({});
  const [excessCents, setExcessCents] = useState(0);
  const { groupsData: groups } = useGroups();
  
  const [page, setPage] = useState(1);
  const [splitting, setSplitting] = useState(true);

  const [error, setError] = useState("");

  const currentUserId = useUserStore((state) => state.currentUserId);

  console.log(currentUserId);

  const resetToDefault = () => {
    setExpenseName("");
    setExpenseDollars('00');
    setExpenseCents('00');
    setPage(1);
    setSplitting(true)
    setSelectedGroup(group);
  }

  const handleNext = () => {
    if (!expenseName.trim() || !selectedGroup) {
      setError("Expense name is required");
      return;
    }
    setPage(2);
    return;
  }

  const handleSave = () => {
    if (!expenseName.trim()) {
      setError("Expense name is required");
      return;
    }
    onSave(expenseName.trim());
    handleClose();
  };

  const handleMode = () => {
    setSplitting(!splitting);
  }

  const handleEvenSplit = () => {
    const dollars = Number(expenseDollars);
    const cents = Number(expenseCents);
    const totalCents = dollars * 100 + cents;
    const numPeople = payers.length || 1;
    const split = Math.floor(totalCents / numPeople);
    const splitDollars = Math.floor(split / 100);
    const splitCents = split % 100;
    setExcessCents(totalCents - split * numPeople);
    const newAmounts: { [key: string]: {dollars: string, cents: string} } = {};
    payers.forEach((payer) => {
      newAmounts[payer.id] = {dollars: splitDollars.toString(), cents: ((excessCents) > 0 ? (splitCents + 1) : splitCents).toString().padEnd(2, '0')};
      setExcessCents(excessCents - 1);
    });
    setIndividualAmounts(newAmounts);
  }

  const handleClose = () => {
    resetToDefault();
    setError("");
    onClose();
  };

  const handleBack = () => {
    setPage(1);
    setError("");
  }

  const handleKeyPressText = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  // Don't allow non-numeric input
  const handleKeyPressNumber = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleClose();
    } 
    if (e.ctrlKey || e.metaKey) return;

    if (!/[0-9]/.test(e.key) && !TEXT_EDITING.includes(e.key)) 
      e.preventDefault();
  };

  if (!isOpen) return null;

  if (page == 1) {
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
                Create New Group Expense
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
                onKeyDown={handleKeyPressText}
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
                  marginTop: "12px",
                }}
              >
                Select Group
              </label>
              <select
                value={selectedGroup ?? ""}
                onChange={(e) =>
                  setSelectedGroup(e.target.value === "" ? null : e.target.value)
                }
                style={{
                  padding: "12px",
                  border: error ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                  textAlign: "center",
                  color: selectedGroup ? BLACK : TEXT_COLOR,
                }}
              >
                {/* Placeholder */}
                <option value="" disabled hidden>
                  Select a Group
                </option>

                {groups?.map((group: {id: string, name: string, created_at: string}) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "8px",
                  marginTop: "12px",
                }}
              >
                Expense Description
              </label>
              <input
                type="text"
                value={expenseDescription}
                onChange={(e) => {
                  setExpenseDescription(e.target.value);
                  if (error) setError(""); // Clear error when user types
                }}
                onKeyDown={handleKeyPressText}
                placeholder="Enter expense description"
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
                onClick={handleNext}
                disabled={!expenseName.trim() || !selectedGroup}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  color: TEXT_COLOR,  
                  fontSize: "14px",
                  cursor: expenseName.trim() && selectedGroup? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (expenseName.trim() && selectedGroup) {
                    e.currentTarget.style.backgroundColor = BUTTON_HOVER_COLOR;
                    e.currentTarget.style.color = WHITE;
                  }
                }}
                onMouseLeave={(e) => {
                  if (expenseName.trim() && selectedGroup) {
                    e.currentTarget.style.backgroundColor = BUTTON_COLOR;
                    e.currentTarget.style.color = TEXT_COLOR;
                  }
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else {
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
                Create New Group Expense
              </h3>
            </div>
            <div>
              <button
                onClick={handleMode}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #d1d5db",
                  borderTopLeftRadius: "6px",
                  borderBottomLeftRadius: "6px",
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  backgroundColor: splitting ? BUTTON_COLOR : WHITE,
                  color: TEXT_COLOR,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  width: "50%",
                }}
              >
                Split Evenly
              </button>
              <button
                onClick={handleMode}
                disabled={!expenseName.trim() || !selectedGroup}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #d1d5db",
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  backgroundColor: !splitting ? BUTTON_COLOR: WHITE,
                  color: TEXT_COLOR,  
                  fontSize: "14px",
                  cursor: expenseName.trim() && selectedGroup? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                  width: "50%",
                }}
              >
                Custom Amounts
              </button>
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
                  marginTop: "12px",
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
                onKeyDown={handleKeyPressNumber}
                placeholder="00"
                style={{
                  width: "calc(4em + 8px)",
                  padding: "6px",
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
                inputMode="numeric"
                pattern="[0-9]*"
              />.
              <input
                type="text"
                value={expenseCents}
                onChange={(e) => {
                  setExpenseCents(e.target.value);
                  if (error) setError(""); // Clear error when user types
                }}
                onKeyDown={handleKeyPressNumber}
                placeholder="00"
                maxLength={2}
                style={{
                  width: "calc(4em + 8px)",
                  padding: "6px",
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
                inputMode="numeric"
                pattern="[0-9]*"
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
                onClick={handleBack}
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
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={!expenseName.trim()}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  color: TEXT_COLOR,
                  fontSize: "14px",
                  cursor: expenseName.trim() ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (expenseName.trim()) {
                    e.currentTarget.style.backgroundColor = BUTTON_HOVER_COLOR;
                    e.currentTarget.style.color = WHITE;
                  }
                }}
                onMouseLeave={(e) => {
                  if (expenseName.trim()) {
                    e.currentTarget.style.backgroundColor = BUTTON_COLOR;
                    e.currentTarget.style.color = TEXT_COLOR;
                  }
                }}
              >
                Create Expense
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
};