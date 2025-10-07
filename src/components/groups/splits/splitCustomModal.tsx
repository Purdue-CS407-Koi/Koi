import React, { useState } from "react";

// constants
import { TEXT_EDITING } from "@/config/keyboardEvents";

// hooks
import useSplits from "@/hooks/useSplits";
import useUsers from "@/hooks/useUsers";

//types
import type { TablesInsert } from "@/helpers/supabase.types";

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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          className="relative bg-white rounded-xl p-6 w-full max-w-[400px] m-4 shadow-[0_10px_25px_rgba(0,0,0,0.1)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-5">
            <h3 className="m-0 text-lg font-semibold text-black" >
              Custom Amounts
            </h3>
          </div>
          
          {/* Input */}
          <div className="mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 my-3">
                Split Options for ${(expense?.amount ?? 0).toFixed(2)}
              </label>
              <ul>
                {members?.map((m) => (
                  <li key={m.id} className="flex items-center gap-3">
                    <div className="px-2 py-1 rounded flex items-center mt-4">
                      {m.id == userData?.id
                        ? `(Paid by) ${m.name}` 
                        :
                        <div>
                          {m.name}: $
                          <input
                            type="text"
                            value={individualAmounts[m.id]?.dollars}
                            onChange={(e) => {
                              setAmount(m.id, { dollars: e.target.value });
                              if (error) setError(""); // Clear error when user types
                            }}
                            onKeyDown={handleKeyPressNumber}
                            placeholder="00"
                            className={`
                              w-[calc(4em+8px)] min-w-[calc(4em+8px)]
                              p-0.5 text-sm text-right 
                              outline-none box-border 
                              border-b-2 transition-colors duration-200
                              ${error ? "border-red-500" : "border-gray-500"}
                            `}
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                          .
                          <input
                            type="text"
                            value={individualAmounts[m.id]?.cents}
                            onChange={(e) => {
                              setAmount(m.id, { cents: e.target.value });
                              if (error) setError(""); // Clear error when user types
                            }}
                            onKeyDown={handleKeyPressNumber}
                            placeholder="00"
                            maxLength={2}
                            className={`
                              w-[2em] min-w-[2em]
                              p-0.5 text-sm  
                              outline-none box-border 
                              border-b-2 transition-colors duration-200
                              ${error ? "border-red-500" : "border-gray-500"}
                            `}
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                        </div>
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
          </div>

          {/* Buttons */}
          <div className={"flex gap-3 justify-end"}>
            <button
              onClick={handleBack}
              className={`
                px-5 py-2.5 border border-gray-300 rounded-md bg-white 
                text-gray-700 text-sm cursor-pointer transition-all duration-200
                hover:bg-gray-300
              `}
            >
              Back
            </button>
            <button
              onClick={handleSave}
              disabled={!expense}
              className={`
                px-5 py-2.5 rounded-[6px] text-[14px] transition-all duration-200
                ${expense ? "cursor-pointer" : "cursor-not-allowed"}
                hover:bg-[var(--color-button-hover)] hover:text-white
              `}
            >
              Create Expense
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
