import useExpenses from "@/hooks/useExpenses";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  IconButton,
} from "@mui/material";
import { useState, type FormEvent } from "react";
import type { CustomCellRendererProps } from "ag-grid-react";
import type { TablesInsert } from "@/helpers/supabase.types";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const { expenseComments, insertNewExpenseComment, deleteExpenseComment } =
    useExpenses();

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

  const handleDeleteExpenseComment = (id: string) => {
    deleteExpenseComment(id);
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle className="!text-center !pb-0">Comments</DialogTitle>
        <DialogContent className="w-[500px] flex flex-col gap-4">
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
          <div className="flex flex-col gap-2">
            {expenseComments?.map((comment) => {
              return (
                <div className="border-solid border-[0.5px] border-gray-400 rounded-lg flex flex-row justify-between p-2">
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500">
                      {comment.created_at}
                    </p>
                    <p className="py-2">{comment.content}</p>
                  </div>
                  <IconButton
                    onClick={() => handleDeleteExpenseComment(comment.id)}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
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
