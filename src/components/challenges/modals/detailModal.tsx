import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import type { Tables } from "@/helpers/supabase.types";

type DetailModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  challenge?: (Tables<"Challenges"> & { amount_used: number, joined: string }) | null;
}

export const DetailModal: React.FC<DetailModalProps> = ({ isOpen, closeModal, challenge }) => {
  if (!challenge) return null;
  return (
    <Dialog 
      open={isOpen}
      onClose={closeModal}
      fullWidth
      maxWidth="xs"
      >
      {/* Header */}
      <DialogTitle>
        <h3 className="m-0 text-lg font-semibold text-black text-center" >
          Challenge Details
        </h3>
      </DialogTitle>

      {/* Input */}
      <DialogContent>
        <div className="leading-normal flex flex-col mb-5 text-[var(--color-text-primary)]">
          <div className="text-lg">
            {challenge.name}
          </div>
          <div className="text-2xl">
            ${challenge.amount_used}/${challenge.amount}
          </div>
          <div className="text-sm text-gray-400">
            Joined on {new Date(challenge.joined ?? "").toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-400">
            Created on {new Date(challenge.created_at ?? "").toLocaleDateString()}
          </div>
          {challenge.end && 
            <div className="text-sm text-gray-400">
              Ends on {new Date(challenge.end).toLocaleDateString()}
            </div>
          }
        </div>          
        <DialogActions>
          <Button
            onClick={closeModal}
            className={`
              !text-[var(--color-text-primary)] !pl-3
            `}
          >
            Close
          </Button>
          <Button
            className="!text-[var(--color-text-primary)] !bg-[var(--color-primary-container)] !pl-3 
              hover:!bg-[var(--color-button-hover)] hover:!text-white"
          >
            Okay
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}