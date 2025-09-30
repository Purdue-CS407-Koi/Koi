import React, { useState } from "react";
import { insertGroup, insertGroupMembership } from "../../api/groups";
import supabase from "../../helpers/supabase";

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupName: string) => void;
}

export const AddGroupModal: React.FC<AddGroupModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    try {
      // Get the current logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("You must be signed in to create a group.");
        return;
      }

      const group = await insertGroup(groupName.trim());
      await insertGroupMembership(user.id, group.id);
      onSave(groupName.trim());
      handleClose();
    } catch (err: any) {
      console.error("Error creating group:", err);
      setError("Failed to create group. Please try again.");
    }
  };

  const handleClose = () => {
    setGroupName("");
    setError("");
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
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
              Create New Group
            </h3>
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Enter a name for your new group
            </p>
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
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                if (error) setError(""); // Clear error when user types
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter group name"
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
              onClick={handleSave}
              disabled={!groupName.trim()}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: groupName.trim() ? "#3b82f6" : "#9ca3af",
                color: "white",
                fontSize: "14px",
                cursor: groupName.trim() ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (groupName.trim()) {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                }
              }}
              onMouseLeave={(e) => {
                if (groupName.trim()) {
                  e.currentTarget.style.backgroundColor = "#3b82f6";
                }
              }}
            >
              Create Group
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
