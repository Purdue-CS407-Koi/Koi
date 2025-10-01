import { type FormEvent } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
} from "@mui/material";

const NewBucketModal = ({open, setOpen}: {open: boolean, setOpen: (open: boolean) => void}) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // const formData = new FormData(event.currentTarget);
    // const formJson = Object.fromEntries(formData.entries());
    // const newBucket = {
    //   name: formJson.name,
    // };

    // TODO: actually mutate store here!

    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Add New Bucket</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} id="new-bucket-form">
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Bucket Name"
            fullWidth
          />
        </form>
      </DialogContent>
      <DialogActions className="!p-6 !pt-0">
        <Button
          onClick={() => {
            setOpen(false)
          }}
          variant="contained"
          className="!bg-gray-400"
        >
          Cancel
        </Button>
        <Button type="submit" form="new-bucket-form" variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewBucketModal;