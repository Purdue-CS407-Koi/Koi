import useExpenses from "@/hooks/useExpenses";
import type { UpdateExpenseProps } from "@/interfaces/Expense";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
} from "@mui/material";
import { useState, type FormEvent } from "react";
import type { CustomCellRendererProps } from "ag-grid-react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

export const EditExpenseCellRenderer = (props: CustomCellRendererProps) => {
  const [open, setOpen] = useState(false);
  const { updateExpense } = useExpenses();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const updatedExpense: UpdateExpenseProps = {
      amount: formJson.amount,
      description: formJson.description,
      name: formJson.name,
      id: props.data.id,
    };
    updateExpense(updatedExpense);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleClickOpen} variant="contained">
        <ModeEditIcon />
      </Button>
      <Dialog open={open}>
        <DialogTitle>Update Expense</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="update-expense-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Expense Name"
              placeholder={props.data.name}
              fullWidth
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="amount"
              name="amount"
              label="Amount"
              placeholder={props.data.amount}
              fullWidth
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="description"
              name="description"
              label="Description"
              placeholder={props.data.description}
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions className="!p-6 !pt-0">
          <Button
            onClick={handleClose}
            variant="contained"
            className="!bg-gray-400"
          >
            Cancel
          </Button>
          <Button type="submit" form="update-expense-form" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
