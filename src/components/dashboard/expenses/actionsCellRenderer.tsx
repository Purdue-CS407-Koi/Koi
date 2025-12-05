import { IconButton } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CommentIcon from "@mui/icons-material/Comment";
import { DeleteExpenseModal } from "./modals/deleteExpenseModal";
import { EditExpenseModal } from "./modals/editExpenseModal";
import { CommentsModal } from "./modals/commentsModal";
import { useExpenseStore } from "@/stores/useExpenseStore";

export const ActionsCellRenderer = (props: CustomCellRendererProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const setCurrentExpenseId = useExpenseStore(
    (state) => state.setCurrentExpenseId
  );

  const handleClickOpenDelete = () => {
    setDeleteOpen(true);
  };

  const handleClickOpenEdit = () => {
    setEditOpen(true);
  };

  const handleClickOpenComments = () => {
    setCurrentExpenseId(props.data.id);
    setCommentsOpen(true);
  };

  return (
    <div>
      <IconButton onClick={handleClickOpenEdit} aria-label="edit">
        <ModeEditIcon />
      </IconButton>
      <IconButton onClick={handleClickOpenDelete} aria-label="delete">
        <DeleteIcon />
      </IconButton>
      <IconButton onClick={handleClickOpenComments} aria-label="comment">
        <CommentIcon />
      </IconButton>
      <DeleteExpenseModal
        cellProps={props}
        open={deleteOpen}
        setOpen={setDeleteOpen}
      />
      <EditExpenseModal
        cellProps={props}
        open={editOpen}
        setOpen={setEditOpen}
      />
      <CommentsModal
        cellProps={props}
        open={commentsOpen}
        setOpen={setCommentsOpen}
      />
    </div>
  );
};
