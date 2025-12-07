import React, { useCallback, useState, useEffect } from "react";

// hooks
import useSplits from "@/hooks/useSplits";
import useUsers from "@/hooks/useUsers";
import useNotifications from "@/hooks/useNotifications";

// components
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

//types
import type { TablesInsert } from "@/helpers/supabase.types";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

interface SplitEvenlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: TablesInsert<"Expenses">) => Promise<string>;
  setPage: (page: number) => void; 
  expense: TablesInsert<"Expenses"> | null;
  selectedGroup: string;
  members: any[] | undefined;
  refetch : () => void;
}

export const SplitEvenlyModal: React.FC<SplitEvenlyModalProps> = ({
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
  const { insertNewNotification } = useNotifications();
  const { userData } = useUsers();

  const [payers, setPayers] = useState<{ name: string; id: string }[]>(members ?? []);
  const [nonpayers, setNonpayers] = useState<{ name: string; id: string }[]>(
    []
  );
  const [individualAmounts, setIndividualAmounts] = useState<
    Record<string, { dollars: string; cents: string }>
  >({});

  const [error, setError] = useState("");

  useEffect(() => {
    if ((members?.length ?? 0) > 0) {
      setPayers(members ?? []);
      handleEvenSplit();
    }
  }, [members]);

  useEffect(() => {
    handleEvenSplit()
  }, [expense, JSON.stringify(payers)]);

  const handleSave = async () => {
    if (expense) {
      const expense_id = await onSave(expense);
      Object.entries(individualAmounts).forEach(([id, { dollars, cents }]) => {
        if (id != expense.user_id) {
          const amount = Number(dollars) + Number(cents) / 100;

          const split = {
            amount_owed: amount,
            amount_remaining: amount,
            original_expense_id: expense_id,
            group_id: selectedGroup,
            user_id: id,
          };

          insertNewSplit(split);

          insertNewNotification({
            receiverId: id,
            groupId: selectedGroup,
            expenseId: expense_id,
            amount: amount,
            isSplit: true,
          });

        } else {
          const split = {
            amount_owed: 0,
            amount_remaining: 0,
            original_expense_id: expense_id,
            group_id: selectedGroup,
            user_id: id,
          };

          insertNewSplit(split);
        }
      });
      handleClose();
      await refetch();
    }
    else {
      setError("Please create a valid expense");
      setPage(1);
    }
  };

  const handleEvenSplit = useCallback(() => {
    const amount = (expense?.amount ?? 0) * 100;
    const numPeople = payers.length || 1;
    const split = Math.floor(amount / numPeople);
    const splitDollars = Math.floor(split / 100);
    const splitCents = split % 100;
    const excess_cents = amount - split * numPeople;
    const newAmounts: { [key: string]: { dollars: string; cents: string } } = {};
    payers.forEach((payer, index) => {
      newAmounts[payer.id] = {
        dollars: splitDollars.toString(),
        cents: (excess_cents > index ? splitCents + 1 : splitCents)
          .toString()
          .padEnd(2, "0"),
      };
    });
    setIndividualAmounts(newAmounts);
  }, [payers, expense]);

  const removePayer = (id: string, name: string) => {
    setNonpayers((prev) => [...prev, { id, name }]);
    setPayers((prev) => prev.filter((p) => p.id !== id));
  };

  const addPayer = (id: string, name: string) => {
    setPayers((prev) => [...prev, { id, name }]);
    setNonpayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  const handleBack = () => {
    setPage(1);
    setError("");
  };

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
            <ul>
              {payers?.map((m) => (
                <li key={m.id} className="p-3 flex items-center gap-3">
                  {m.id == userData?.id ? (
                    <div>
                      {"(Paid by) " + m.name}
                      {`: $${individualAmounts[m.id]?.dollars ?? "00"}.${individualAmounts[m.id]?.cents ?? "00"}`}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="px-2 py-1 flex justify-center items-center"
                        onClick={() => removePayer(m.id, m.name)}
                      >
                        <RemoveIcon fontSize="small"/>
                      </button>
                      <div>
                        {m.name ?? "Unnamed user"}
                        {`: ${individualAmounts[m.id]?.dollars ?? "00"}.${individualAmounts[m.id]?.cents ?? "00"}`}
                      </div>
                    </div>
                  )}
                </li>
              ))}
              {nonpayers?.map((m) => (
                <li key={m.id} className="p-3 flex items-center gap-3">
                  <button
                    type="button"
                    className="px-2 py-1 flex justify-center items-center"
                    onClick={() => addPayer(m.id, m.name)}
                  >
                    <AddIcon fontSize="small" />
                  </button>
                  <div className="text-gray-400">
                    {m.name ?? "Unnamed user"}
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
