import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { EditGroupModal } from "./editGroupModal";
import { LeaveGroupModal } from "./leaveGroupModal";

interface GroupMoreActionsProps {
  groupId: string;
  groupName: string;
}

export const GroupMoreActions: React.FC<GroupMoreActionsProps> = ({
  groupId,
  groupName,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    handleMenuClose();
    setEditModalOpen(true);
  };

  const handleLeave = () => {
    handleMenuClose();
    setLeaveModalOpen(true);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Tooltip title="More actions">
        <IconButton size="small" onClick={handleMenuOpen}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        slotProps={{
          list: { "aria-labelledby": "group-more-actions" },
        }}
      >
        <MenuItem onClick={handleEdit}>Edit Group</MenuItem>
        <MenuItem onClick={handleLeave}>Leave Group</MenuItem>
      </Menu>

      {editModalOpen && (
        <EditGroupModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          groupId={groupId}
          groupName={groupName}
        />
      )}

      {leaveModalOpen && (
        <LeaveGroupModal
          open={leaveModalOpen}
          onClose={() => setLeaveModalOpen(false)}
          groupId={groupId}
          groupName={groupName}
        />
      )}
    </div>
  );
};
