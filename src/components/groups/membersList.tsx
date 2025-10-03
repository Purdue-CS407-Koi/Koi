import React, { useState } from "react";

interface Member {
  id: string;
  name: string;
  avatar?: string;
}

interface MembersListProps {
  members: Member[];
}

export const MembersList: React.FC<MembersListProps> = ({ members }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Members</h3>
      {members.length === 0 ? (
        <div className="text-sm italic text-gray-500">
          Select a group to view members
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {members.map((member) => (
            <div
              key={member.id}
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: member.avatar ? "transparent" : "#374151",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "600",
                  overflow: "hidden",
                }}
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  member.name.charAt(0).toUpperCase()
                )}
              </div>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#111827",
                }}
              >
                {member.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
