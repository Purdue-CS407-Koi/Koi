import React, { useState } from "react";

// constants
import { TEXT_EDITING } from "@/config/keyboardEvents";

// types
import type { TablesInsert } from "@/helpers/supabase.types";

// mui
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  Stack,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface AddGroupChallengeModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSubmit: (expense: TablesInsert<"Challenges">) => void;
}

export const CreateGroupExpenseModal: React.FC<AddGroupChallengeModalProps> = ({
  isOpen,
  closeModal,
  onSubmit
}) => {
  const [challengeName, setChallengeName] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [challengeDollars, setChallengeDollars] = useState("00");
  const [challengeCents, setChallengeCents] = useState("00");
  const [start, setStart] = useState<Date | null>(new Date());
  const [end, setEnd] = useState<Date | null>(null);

  const [error, setError] = useState("");

  const resetToDefault = () => {
    setChallengeName("");
    setChallengeDollars("00");
    setChallengeCents("00");
    setStart(new Date());
    setEnd(null);
    setChallengeDescription("");
  };

  const handleClose = () => {
    setError("");
    resetToDefault();
    closeModal();
  };

  const handleKeyPressText = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  // Don't allow non-numeric input
  const handleKeyPressNumber = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
    if (e.ctrlKey || e.metaKey) return;

    if (!/[0-9]/.test(e.key) && !TEXT_EDITING.includes(e.key))
      e.preventDefault();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
    > 
      {/* Header */}
      <DialogTitle>
        <h3 className="m-0 text-lg font-semibold text-black" >
          Create New Group Challenge
        </h3>
      </DialogTitle>

      {/* Input */}
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          value={challengeName}
          label="Challenge Name"
          onChange={(e) => {
            setChallengeName(e.target.value);
            if (error) setError(""); // Clear error when user types
          }}
          onKeyDown={handleKeyPressText}
          fullWidth
          className="
            [&_.MuiInputLabel-root.Mui-focused]:!text-[var(--color-button-hover)]
            [&_.MuiOutlinedInput-root:hover_.MuiOutlinedInput-notchedOutline]:!border-[var(--color-button-hover)]
            [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:!border-[var(--color-button-hover)]
            !mb-4
          "
        />

        <TextField
          autoFocus
          margin="dense"
          value={challengeDescription}
          label="Challenge Description"
          onChange={(e) => {
            setChallengeDescription(e.target.value);
            if (error) setError(""); // Clear error when user types
          }}
          onKeyDown={handleKeyPressText}
          fullWidth
          className="
            [&_.MuiInputLabel-root.Mui-focused]:!text-[var(--color-button-hover)]
            [&_.MuiOutlinedInput-root:hover_.MuiOutlinedInput-notchedOutline]:!border-[var(--color-button-hover)]
            [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:!border-[var(--color-button-hover)]
            !mb-4
          "
        />
        
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div
            className="
              hover:[&_.MuiPickersOutlinedInput-root_fieldset.MuiPickersOutlinedInput-notchedOutline]:!border-[var(--color-button-hover)]
              focus-within:[&_.MuiPickersOutlinedInput-root_fieldset.MuiPickersOutlinedInput-notchedOutline]:!border-[var(--color-button-hover)]
              mb-4
            "
          >
            <DatePicker
              label="Start date *"
              value={start}
              onChange={(newValue) => setStart(newValue)}
              slotProps={{ 
                textField: {
                  fullWidth: true,
                  className: `
                    [&_.MuiInputLabel-root.Mui-focused]:!text-[var(--color-button-hover)]
                    [&_.MuiOutlinedInput-root:hover_.MuiOutlinedInput-notchedOutline]:!border-[var(--color-button-hover)]
                    [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:!border-[var(--color-button-hover)]
                  `,
                },
              }}
            />
          </div>
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDateFns}>     
          <div
            className="
              hover:[&_.MuiPickersOutlinedInput-root_fieldset.MuiPickersOutlinedInput-notchedOutline]:!border-[var(--color-button-hover)]
              focus-within:[&_.MuiPickersOutlinedInput-root_fieldset.MuiPickersOutlinedInput-notchedOutline]:!border-[var(--color-button-hover)]
              mb-4
            "
          >
            <DatePicker
              label="End date"
              value={end}
              onChange={(newValue) => setEnd(newValue)}
              slotProps={{ 
                textField: {
                  fullWidth: true,
                  className: `
                    [&_.MuiInputLabel-root.Mui-focused]:!text-[var(--color-button-hover)]
                    [&_.MuiOutlinedInput-root:hover_.MuiOutlinedInput-notchedOutline]:!border-[var(--color-button-hover)]
                    [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:!border-[var(--color-button-hover)]
                  `,
                },
              }}
            />
          </div>     
        </LocalizationProvider>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" component="span">
            $
          </Typography>
          <TextField
            variant="standard"
            value={challengeDollars}
            onChange={(e) => {
              setChallengeDollars(e.target.value);
              if (error) setError(""); // Clear error when user types
            }}
            onKeyDown={handleKeyPressNumber}
            placeholder="00"
            className="
              [&_.MuiInput-underline:before]:!border-gray-400
              hover:[&_.MuiInput-underline:before]:!border-[var(--color-button-hover)]
              focus-within:[&_.MuiInput-underline:after]:!border-[var(--color-button-hover)]
              [&_.MuiInputBase-input]:!text-right
              [&_.MuiInput-underline:after]:!border-[var(--color-button-hover)]
            "
          />
          <Typography variant="h6" component="span">
            .
          </Typography>
          <TextField
            variant="standard"
            value={challengeCents}
            onChange={(e) => {
              const v = e.target.value.slice(0, 2); // max 2 chars
              setChallengeCents(v);
              setError("");
            }}
            onKeyDown={handleKeyPressNumber}
            placeholder="00"
            className="
              [&_.MuiInput-underline:before]:!border-gray-400
              hover:[&_.MuiInput-underline:before]:!border-[var(--color-button-hover)]
              focus-within:[&_.MuiInput-underline:after]:!border-[var(--color-button-hover)]
              [&_.MuiInput-underline:after]:!border-[var(--color-button-hover)]
            "
          />
        </Stack>
        
        {error && (
          <p className="mt-2 text-xs text-[var(--color-error)]">
            {error}
          </p>
        )}
      </DialogContent>
      <DialogActions className="!flex !gap-1 !items-center !mb-2 mr-4">
        <Button
            onClick={handleClose}
            className={`
              !text-[var(--color-text-primary)] !pl-3
            `}
          >
            Cancel
          </Button>
          <Button
            className="!text-[var(--color-text-primary)] !bg-[var(--color-primary-container)]
              hover:!bg-[var(--color-button-hover)] hover:!text-white"
            onClick={() => {
              const totalAmount = parseInt(challengeDollars || "0") * 100 + parseInt(challengeCents || "0");
              if (!challengeName.trim()) {
                setError("Challenge name is required.");
                return;
              }
              if (!start) {
                setError("Start date is required.");
                return;
              }
              if (end && start > end) {
                setError("End date must be after start date.");
                return;
              }
              onSubmit({
                name: challengeName.trim(),
                description: challengeDescription.trim() ?? null,
                amount: totalAmount,
                start: start.toISOString(),
                end: end ? end.toISOString() : null,
              });
              handleClose();
            }}
          >
            Save Challenge
          </Button>
      </DialogActions>
    </Dialog>
  );
};
