import React, { useState } from "react";

// constants
import { TEXT_EDITING } from "@/config/keyboardEvents";

// hooks
import useSplits from "@/hooks/useSplits";
import useUsers from "@/hooks/useUsers";

//types
import type { TablesInsert } from "@/helpers/supabase.types";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";

interface SplitCustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: TablesInsert<"Expenses">) => Promise<string>;
  setPage: (page: number) => void; 
  expense: TablesInsert<"Expenses"> | null;
  selectedGroup: string;
  members: any[] | undefined;
  refetch: () => void;
}

export const SplitCustomModal: React.FC<SplitCustomModalProps> = ({
  isOpen,
  onClose,
  onSave,
  setPage,
  expense,
  selectedGroup,
  members,
  refetch,
}) => {
  const { insertNewSplit } = useSplits();
  const { userData } = useUsers();

  const [individualAmounts, setIndividualAmounts] = useState<
    Record<string, { dollars: string; cents: string }>
  >({});

  const [error, setError] = useState("");

  const handleSave = async () => {
    if (expense) {

      let totalCents = 0;

      Object.values(individualAmounts).forEach(({ dollars, cents }) => {
        const d = parseInt(dollars || "0", 10);
        const c = parseInt(cents || "0", 10);
        totalCents += d * 100 + c;
      });

      const check = Math.floor(totalCents / 100) + (totalCents % 100);
      const amount = expense.amount;

      if (check > amount) {
        setError("Total amount cannot be over the intial payment!");
        return;
      }

      const expense_id = await onSave(expense);
      const split = {
        amount_owed: 0,
        amount_remaining: 0,
        original_expense_id: expense_id,
        group_id: selectedGroup,
        user_id: userData?.id ?? "",
      };

      insertNewSplit(split);

      Object.entries(individualAmounts).forEach(([id, { dollars, cents }]) => {
        const amount = Number(dollars) + Number(cents) / 100;

        if (amount != 0) {
          const split = {
            amount_owed: amount,
            amount_remaining: amount,
            original_expense_id: expense_id,
            group_id: selectedGroup,
            user_id: id,
          };

          insertNewSplit(split);
        }
      });
      await refetch();
      handleClose();
    } else {
      setError("Please create a valid expense");
      setPage(1);
    }
  };

  const setAmount = (
    id: string,
    patch: Partial<{ dollars: string; cents: string }>
  ) => {
    setIndividualAmounts((prev) => {
      const curr = prev[id] ?? { dollars: "", cents: "" };
      return { ...prev, [id]: { ...curr, ...patch } };
    });
  };

  const handleClose = () => {
    setError("");
    setIndividualAmounts({});
    onClose();
  };

  const handleBack = () => {
    setPage(1);
    setError("");
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


  if (!isOpen) return null;

  return (
    <>
      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
      >
        {/* Header */}
        <DialogTitle>
          <h3 className="m-0 text-lg font-semibold text-black" >
            Splitting Evenly
          </h3>
        </DialogTitle>
        
        {/* Input */}
        <DialogContent>
          <div>
            <label className="block text-sm font-medium text-gray-700 my-3">
              Split Options for ${(expense?.amount ?? 0).toFixed(2)}
            </label>
            <ul>
              {members?.map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <div className="px-2 py-1 rounded flex items-center mt-4">
                    {m.id == userData?.id ?
                      <Typography component="span">
                        (Paid by) {m.name}
                      </Typography>
                      :
                      <Stack direction="row" alignItems="center" spacing={1} flexWrap="nowrap">
                        <Typography component="span" display="inline">
                          {m.name}: $
                        </Typography>
                        <TextField
                          variant="standard"
                          value={individualAmounts[m.id]?.dollars}
                          onChange={(e) => {
                            setAmount(m.id, { dollars: e.target.value });
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
                            !w-[16ch]
                          "
                        />
                        <Typography component="span">
                          .
                        </Typography>
                        <TextField
                          variant="standard"
                          value={individualAmounts[m.id]?.cents}
                          onChange={(e) => {
                            setAmount(m.id, { cents: e.target.value });
                            if (error) setError(""); // Clear error when user types
                          }}
                          onKeyDown={handleKeyPressNumber}
                          placeholder="00"
                          className="
                            [&_.MuiInput-underline:before]:!border-gray-400
                            hover:[&_.MuiInput-underline:before]:!border-[var(--color-button-hover)]
                            focus-within:[&_.MuiInput-underline:after]:!border-[var(--color-button-hover)]
                            [&_.MuiInput-underline:after]:!border-[var(--color-button-hover)]
                            !w-[8ch]
                          "
                        />
                      </Stack>
                    }
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {error && (
            <p className="mt-2 text-xs text-[var(--color-error)]">
              {error}
            </p>
          )}
        </DialogContent>

        {/* Buttons */}
        <DialogActions>
          <Button
            onClick={handleBack}
            className={`
              !text-[var(--color-text-primary)] !pl-3
            `}
          >
            Back
          </Button>
          <Button
            onClick={handleSave}
            className={`
              !text-[var(--color-text-primary)] !bg-[var(--color-primary-container)] !pl-3
              hover:!bg-[var(--color-button-hover)] hover:!text-white
            `}
          >
            Create Expense
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
