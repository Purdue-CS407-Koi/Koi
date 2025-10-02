import {
  IconButton,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";
import { AddGroupModal } from "./addGroupModal";
import { EditGroupModal } from "./editGroupModal";
import useSplits from "@/hooks/useSplits"; 
import { useSplitStore } from "@/stores/useSplitStore";
interface Group {
  id: string;
  name: string;
  createdDate: string;
}

interface GroupsListProps {
  groups: Group[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string, groupName: string) => void;
  onEditGroup: (groupId: string, groupName: string) => void;
}

export const GroupsList: React.FC<GroupsListProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [splitMap, setSplitMap] = useState<Map<string, number>>(new Map());
  const { userSplitsData, isLoadingUserSplits, errorUserSplits } = useSplits();

  const handleEditOpen = (groupId: string, groupName: string) => {
    setEditGroupId(groupId);
    setEditGroupName(groupName);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditGroupId(null);
    setEditGroupName("");
  };

  useEffect(() => {
    if (userSplitsData) {
      userSplitsData.forEach((data) => {
        setSplitMap(prev => {
          const newMap = new Map(prev);
          const current = newMap.get(data.group_id || "") ?? 0;
          newMap.set(data.group_id || "", (data.amount_remaining || 0) + current);
          return newMap
        });
      });
    }
  }, [userSplitsData]);

  // TODO: replace with mui icon
  const getGroupIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-sidebar-title">Groups</h3>
      <div className="flex flex-col gap-2">
        {groups.map((group) => {
          const isSelected = selectedGroupId === group.id;

          return (
            <div
              key={group.id}
              onClick={() =>
                isSelected
                  ? onSelectGroup("", "") // unselect when clicked again
                  : onSelectGroup(group.id, group.name)
              }
              className={`group flex items-center justify-between py-2 px-2 rounded-md cursor-pointer transition-colors
              ${isSelected ? "bg-gray-200" : "hover:bg-gray-100"}
            `}
            >
              {/* Left: Icon + text */}
              <div className="flex items-center gap-3 w-full">
                <div className="flex items-center justify-center w-5">
                  {getGroupIcon()}
                </div>
                <div className="w-full">
                  <div className="text-sm font-medium text-sidebar-entry flex w-full">
                    <div>
                      {group.name}
                    </div>
                    <div className="text-right ml-auto">
                      {(splitMap.get(group.id)?.toFixed(2) ?? 0) == 0 ? "Settled Up" : `You owe $${splitMap.get(group.id)?.toFixed(2)}`}
                    </div>
                  </div>
                  <div className="text-xs text-sidebar-entry-subtext">
                    {`Created ${group.createdDate}`}
                  </div>
                </div>
              </div>

              {/* Right: Edit button (appears on hover) */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip title="Edit Group">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditOpen(group.id, group.name);
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>
      <AddGroupModal />
      <EditGroupModal
        open={editOpen}
        onClose={handleEditClose}
        groupId={editGroupId}
        groupName={editGroupName}
      />
    </div>
  );
};
