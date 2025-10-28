import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

type ConfirmationModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
};

export const ConfirmationModal: React.FC<ConfirmationModalProps>  = ({isOpen, closeModal, onSubmit, children}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
    >
      <DialogTitle className="text-lg font-bold">
        {children}
      </DialogTitle>
      <DialogActions className="!p-6 !pt-0">
        <Button
          onClick={closeModal}
          variant="contained"
          className="!bg-gray-400"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          className="!text-[var(--color-text-primary)] !bg-white !pl-3 hover:!bg-[var(--color-button-hover)] hover:!text-white"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}