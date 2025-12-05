import useExpenses from "@/hooks/useExpenses";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import { useState, type FormEvent, type MouseEvent } from "react";
import type { CustomCellRendererProps } from "ag-grid-react";
import type { TablesInsert } from "@/helpers/supabase.types";

interface CommentsModalProps {
  cellProps: CustomCellRendererProps;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const CommentsModal = ({
  cellProps,
  open,
  setOpen,
}: CommentsModalProps) => {
  const { expenseComments, insertNewExpenseComment } = useExpenses();

  const [content, setContent] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newExpenseComment: TablesInsert<"ExpenseComments"> = {
      content: content,
      expense_id: cellProps.data.id,
    };
    insertNewExpenseComment(newExpenseComment);
    setContent("");
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle className="!text-center !pb-0">Comments</DialogTitle>
        <DialogContent sx={{ width: "500px" }}>
          <div className="flex flex-col">
            <form onSubmit={handleSubmit} id="new-expense-comment-form">
              <TextField
                autoFocus
                margin="dense"
                id="content"
                name="content"
                label="New comment"
                fullWidth
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </form>
            <Button
              type="submit"
              form="new-expense-comment-form"
              variant="contained"
              className="self-end"
            >
              Comment
            </Button>
          </div>
          <div>
            {expenseComments?.map((comment) => {
              return (
                <div>
                  <p className="py-2">{comment.created_at}</p>
                  <p className="py-2">{comment.content}</p>
                </div>
              );
            })}
          </div>
        </DialogContent>
        <DialogActions className="!p-6 !pt-0 !justify-center">
          <Button
            onClick={handleClose}
            variant="contained"
            className="!bg-gray-400"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
