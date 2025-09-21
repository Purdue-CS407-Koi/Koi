import React, { useState } from "react";

interface Group {
  id: string;
  name: string;
  createdDate: string;
  type?: "default" | "trip";
}

interface GroupsListProps {
  groups: Group[];
  onAddGroup: () => void;
}

export const GroupsList: React.FC<GroupsListProps> = ({
  groups,
  onAddGroup,
}) => {
  const getGroupIcon = (type?: string) => {
    if (type === "trip") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
          <path d="M12 2L3 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-9-5z" />
        </svg>
      );
    }
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.75 1.75 0 0 0 18.3 7.5c-.93 0-1.68.7-1.75 1.61L14.92 16H12v6h8z" />
      </svg>
    );
  };

  return (
    <div>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "600",
          marginBottom: "16px",
          color: "#111827",
        }}
      >
        Groups
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {groups.map((group) => (
          <div
            key={group.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "20px",
              }}
            >
              {getGroupIcon(group.type)}
            </div>
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#111827",
                }}
              >
                {group.name}
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                {group.type === "default"
                  ? "Default"
                  : `Created ${group.createdDate}`}
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={onAddGroup}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px",
            background: "none",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            cursor: "pointer",
            color: "#6b7280",
            fontSize: "14px",
            marginTop: "8px",
          }}
        >
          <span style={{ fontSize: "18px" }}>+</span>
          Add New
        </button>
      </div>
    </div>
  );
};
