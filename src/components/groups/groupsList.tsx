import React from "react";
import { AddGroupModal } from "./addGroupModal";

interface Group {
  id: string;
  name: string;
  createdDate: string;
}

interface GroupsListProps {
  groups: Group[];
  onAddGroup: (groupName: string) => void;
}

export const GroupsList: React.FC<GroupsListProps> = ({ groups }) => {
  const getGroupIcon = () => {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    );
  };

  return (
    <>
      <div>
        <h3 className="text-lg font-semibold mb-4 text-sidebar-title">
          Groups
        </h3>
        <div className="flex flex-col gap-2">
          {groups.map((group) => (
            <div key={group.id} className="flex items-center gap-3 py-2">
              <div className="flex items-center justify-center w-5">
                {getGroupIcon()}
              </div>
              <div>
                <div className="text-sm font-medium text-sidebar-entry">
                  {group.name}
                </div>
                <div className="text-xs text-sidebar-entry-subtext">
                  {`Created ${group.createdDate}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddGroupModal />
    </>
  );
};
