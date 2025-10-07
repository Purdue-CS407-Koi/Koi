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
        <div className="flex flex-col gap-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3"
            >
              <div
                className={`
                  flex w-[40px] h-[40px] text-white justify-center items-center
                  text-base font-semibold overflow-hidden rounded-full
                  ${member.avatar ? "bg-transparent" : "bg-no-avatar"}
                `}
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  member.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-auth-input-label text-base font-medium">
                {member.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
