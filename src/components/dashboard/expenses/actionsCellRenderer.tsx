import { IconButton } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { DeleteExpenseModal } from "./deleteExpense";
import { EditExpenseModal } from "./editExpense";

export const ActionsCellRenderer = (props: CustomCellRendererProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleClickOpenDelete = () => {
    setDeleteOpen(true);
  };

  const handleClickOpenEdit = () => {
    setEditOpen(true);
  };

  return (
    <div>
      <IconButton onClick={handleClickOpenDelete} aria-label="delete">
        <DeleteIcon />
      </IconButton>
      <IconButton onClick={handleClickOpenEdit} aria-label="edit">
        <ModeEditIcon />
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
    </div>
  );
};
