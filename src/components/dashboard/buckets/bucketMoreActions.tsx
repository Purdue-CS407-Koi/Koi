import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import { HideBucketModal } from "./hideBucketModal";
import { EditBucketModal } from "./editBucketModal";

const BucketMoreActions = ({
  bucketMetadataId,
}: {
  bucketMetadataId: string;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [hideModalOpen, setHideModalOpen] = React.useState(false);

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    setEditModalOpen(true);
  };

  const handleHide = () => {
    handleClose();
    setHideModalOpen(true);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
      >
        <MoreVert fontSize="small" />
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleHide}>Hide</MenuItem>
      </Menu>

      <EditBucketModal
        open={editModalOpen}
        setOpen={setEditModalOpen}
        bucketMetadataId={bucketMetadataId}
      />

      <HideBucketModal
        open={hideModalOpen}
        setOpen={setHideModalOpen}
        bucketMetadataId={bucketMetadataId}
      />
    </div>
  );
};

export default BucketMoreActions;
