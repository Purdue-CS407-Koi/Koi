import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { type MouseEvent } from "react";

import { HideSource } from "@mui/icons-material";
import { useBuckets } from "@/hooks/useBuckets";

export const HideBucketModal = ({
  open,
  setOpen,
  bucketMetadataId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  bucketMetadataId: string;
}) => {
  const { hideBucketMetadata } = useBuckets();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    hideBucketMetadata(bucketMetadataId);
    handleClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Confirm bucket hide</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Really hide this bucket? You won't be able to unhide this bucket!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="contained"
          className="!bg-gray-400"
        >
          Cancel
        </Button>
        <Button
          onClick={(e) => handleSubmit(e)}
          form="hide-bucket-form"
          variant="contained"
          startIcon={<HideSource />}
          className="!bg-orange-600"
        >
          Hide
        </Button>
      </DialogActions>
    </Dialog>
  );
};
