import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import type { Tables } from "@/helpers/supabase.types";

type DetailModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  challenge?: (Tables<"Challenges"> & { amount_used: number, joined: string, owner_name?: string | null , is_owner: boolean }) | null;
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
          {challenge.owner_name && 
            <div className="text-sm text-gray-400">
              Group owner: {challenge.owner_name} {challenge.is_owner && "(You)"}
            </div>
          }
          <div className="text-sm text-gray-400">
            Joined: {new Date(challenge.joined ?? "").toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-400">
            Challenge {new Date() > new Date(challenge.start) ? "started" : "starts"}: {new Date(challenge.start).toLocaleDateString()}
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
          {challenge.is_owner ||
            <Button
              className="!text-[var(--color-text-primary)] !bg-[var(--color-primary-container)] !px-3 
                hover:!bg-[var(--color-button-hover)] hover:!text-white"
            >
              Leave
            </Button>
          }
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}