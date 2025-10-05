import useExpenses from "@/hooks/useExpenses";
import { Button, Dialog, DialogTitle, DialogActions } from "@mui/material";
import { type MouseEvent } from "react";
import type { CustomCellRendererProps } from "ag-grid-react";
import DeleteIcon from "@mui/icons-material/Delete";

interface DeleteExpenseModalProps {
  cellProps: CustomCellRendererProps;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const DeleteExpenseModal = ({
  cellProps,
  open,
  setOpen,
}: DeleteExpenseModalProps) => {
  const { deleteExpense } = useExpenses();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    deleteExpense(cellProps.data.id);
    handleClose();
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Confirm deleting this expense?</DialogTitle>
        <DialogActions className="!p-6 !pt-0 !justify-center">
          <Button
            onClick={handleClose}
            variant="contained"
            className="!bg-gray-400"
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => handleSubmit(e)}
            form="update-expense-form"
            variant="contained"
            startIcon={<DeleteIcon />}
            className="!bg-[var(--color-error)]"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
