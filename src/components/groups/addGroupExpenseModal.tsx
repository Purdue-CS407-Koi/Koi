import React, { useEffect, useState } from "react";

// constants
import { TEXT_EDITING } from "@/config/keyboardEvents";

// hooks
import useGroups from "@/hooks/useGroups";
import useSplits from "@/hooks/useSplits";
import useUsers from "@/hooks/useUsers";

// components
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

//types
import type { NewExpense } from "@/interfaces/Expense";

interface AddGroupExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: NewExpense) => Promise<string>;
  group?: any;
}

export const AddGroupExpenseModal: React.FC<AddGroupExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  group = null,
}) => {
  const [expenseName, setExpenseName] = useState("");
  const [expenseDollars, setExpenseDollars] = useState("00");
  const [expenseCents, setExpenseCents] = useState("00");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(group);
  const [payers, setPayers] = useState<{ name: string; id: string }[]>([]);
  const [nonpayers, setNonpayers] = useState<{ name: string; id: string }[]>(
    []
  );
  const [individualAmounts, setIndividualAmounts] = useState<
    Record<string, { dollars: string; cents: string }>
  >({});
  const { groupsData: groups, useGroupMembers } = useGroups();
  const { insertNewSplit } = useSplits();
  const { userData } = useUsers();
  const { groupMembersData: members } = useGroupMembers(selectedGroup ?? "");
  const [page, setPage] = useState(1);
  const [splitting, setSplitting] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    console.log(groups);
    console.log(userData?.id);
  }, [groups, userData]);

  useEffect(() => {
    setPayers(members ?? []);
    setNonpayers([]);
  }, [members]);

  useEffect(() => {
    handleEvenSplit();
  }, [payers]);

  const resetToDefault = () => {
    setExpenseName("");
    setExpenseDollars("00");
    setExpenseCents("00");
    setPage(1);
    setSplitting(true);
    setSelectedGroup(group);
  };

  const handleSplitEvenly = () => {
    if (!expenseName.trim() || !selectedGroup) {
      setError("Expense name/group is required");
      return;
    }
    setError("");

    handleEvenSplit();

    setPage(2);
    return;
  };

  const handleCustomAmounts = () => {
    if (!expenseName.trim() || !selectedGroup) {
      setError("Expense name/group is required");
      return;
    }
    setError("");

    setPage(3);
    return;
  };

  const handleSave = async () => {
    const name = expenseName;
    const user_id = userData?.id;
    const description = expenseDescription;
    if (splitting) {
      const amount = Number(expenseDollars) + Number(expenseCents) / 100;
      const expense = {
        amount,
        description,
        name,
        user_id,
      };
      const expense_id = await onSave(expense);
      Object.entries(individualAmounts).forEach(([id, { dollars, cents }]) => {
        if (id != user_id) {
          const amount = Number(dollars) + Number(cents) / 100;

          const split = {
            amount_owed: amount,
            amount_remaining: amount,
            original_expense_id: expense_id,
            group_id: selectedGroup,
            user_id: id,
          };

          insertNewSplit(split);
        } else {
          const amount = Number(dollars) + Number(cents) / 100;
          const total = Number(expenseDollars) + Number(expenseCents) / 100;
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
    } else {
      let totalCents = 0;

      Object.values(individualAmounts).forEach(({ dollars, cents }) => {
        const d = parseInt(dollars || "0", 10);
        const c = parseInt(cents || "0", 10);
        totalCents += d * 100 + c;
      });

      const check = Math.floor(totalCents / 100) + (totalCents % 100);
      const amount = Number(expenseDollars) + Number(expenseCents) / 100;

      if (check > amount) {
        setError("Total amount cannot be over the intial payment!");
        return;
      }

      const expense = {
        amount,
        description,
        name,
        user_id,
      };
      const expense_id = await onSave(expense);
      Object.entries(individualAmounts).forEach(([id, { dollars, cents }]) => {
        if (id != user_id) {
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
    }
    handleClose();
  };

  const handleEvenSplit = () => {
    const dollars = Number(expenseDollars);
    const cents = Number(expenseCents);
    const totalCents = dollars * 100 + cents;
    const numPeople = payers.length || 1;
    const split = Math.floor(totalCents / numPeople);
    const splitDollars = Math.floor(split / 100);
    const splitCents = split % 100;
    const excess_cents = totalCents - split * numPeople;
    const newAmounts: { [key: string]: { dollars: string; cents: string } } = {};
    payers.forEach((payer, index) => {
      newAmounts[payer.id] = {
        dollars: splitDollars.toString().padStart(2, "0"),
        cents: (excess_cents > index ? splitCents + 1 : splitCents)
          .toString()
          .padEnd(2, "0"),
      };
    });
    setIndividualAmounts(newAmounts);
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

  const removePayer = (id: string, name: string) => {
    setNonpayers((prev) => [...prev, { id, name }]);
    setPayers((prev) => prev.filter((p) => p.id !== id));
  };

  const addPayer = (id: string, name: string) => {
    setPayers((prev) => [...prev, { id, name }]);
    setNonpayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClose = () => {
    resetToDefault();
    setError("");
    onClose();
  };

  const handleBack = () => {
    setPage(1);
    setError("");
  };

  const handleKeyPressText = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  // Don't allow non-numeric input
  const handleKeyPressNumber = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleClose();
    }
    if (e.ctrlKey || e.metaKey) return;

    if (!/[0-9]/.test(e.key) && !TEXT_EDITING.includes(e.key))
      e.preventDefault();
  };

  if (!isOpen) return null;

  if (page == 1) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
          onClick={handleClose}
        >
          {/* Modal */}
          <div
            className="relative bg-white rounded-xl px-6 pt-12 pb-6 w-full max-w-[400px] m-4 shadow-[0_10px_25px_rgba(0,0,0,0.1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className ="absolute top-1 left-1 px-2.5 py-1 rounded-md bg-white text-[#374151] text-sm cursor-pointer transition-all duration-200"
              onClick={handleClose}
            >
              Cancel
            </button>
            
            {/* Header */}
            <div className="mb-5">
              <h3 className="m-0 text-lg font-semibold text-black" >
                Create New Group Expense
              </h3>
            </div>

            {/* Input */}
            <div className="flex flex-col items-center mb-5">
              <input
                type="text"
                value={expenseName}
                onChange={(e) => {
                  setExpenseName(e.target.value);
                  if (error) setError(""); // Clear error when user types
                }}
                onKeyDown={handleKeyPressText}
                placeholder="Enter expense name"
                autoFocus
                className={"w-[70%] p-1.5 text-sm outline-none box-border border-b-2 transition-colors duration-200 " + (error ? "border-red-500" : "border-gray-500")}
              />

              <select
                value={selectedGroup ?? ""}
                onChange={(e) =>
                  setSelectedGroup(
                    e.target.value === "" ? null : e.target.value
                  )
                }
                className={`
                  mt-2 p-1.5 text-sm outline-none box-border border-b-2 transition-colors duration-200 text-center 
                  ${error ? "border-red-500" : "border-gray-500"} 
                  ${selectedGroup ? "text-black" : "text-gray-600"}
                `}
              >
                {/* Placeholder */}
                <option value="" disabled hidden>
                  Select a Group
                </option>

                {groups?.map(
                  (group: { id: string; name: string; created_at: string }) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  )
                )}
              </select>
              {/* <input
                type="text"
                value={expenseDescription}
                onChange={(e) => {
                  setExpenseDescription(e.target.value);
                  if (error) setError(""); // Clear error when user types
                }}
                onKeyDown={handleKeyPressText}
                placeholder="Enter expense description"
                autoFocus
                style={{
                  width: "100%",
                  padding: "2px",
                  borderBottom: error ? "2px solid #ef4444" : "2px solid #757981ff",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = error ? "#ef4444" : "#3b82f6";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = error ? "#ef4444" : "#757981ff";
                }}
              /> */}
              <div className="mt-4 w-fit">
                $
                <input
                  type="text"
                  value={expenseDollars}
                  onChange={(e) => {
                    setExpenseDollars(e.target.value);
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
                  value={expenseCents}
                  onChange={(e) => {
                    setExpenseCents(e.target.value);
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
              <div className="mt-6 leading-normal w-30">
                Split:
              </div>
              <button
                className={`
                  flex flex-row justify-center items-center
                  py-0.5 pr-1.5 pl-2.5
                  border-none rounded-md
                  text-sm transition-all duration-200
                  ${expenseName.trim() && selectedGroup 
                    ? "cursor-pointer" 
                    : "cursor-not-allowed"} 
                  text-[var(--color-text-primary)] bg-white
                  ${!(expenseName.trim() && selectedGroup) || 
                  "hover:bg-[var(--color-button-hover)] hover:text-white"}
                `}
                onClick={handleSplitEvenly}
              >
                Evenly
                <NavigateNextIcon/>
              </button>
              <button
                onClick={handleCustomAmounts}
                className={`
                  flex flex-row justify-center items-center
                  py-0.5 pr-1.5 pl-2.5
                  border-none rounded-md
                  text-sm transition-all duration-200
                  ${expenseName.trim() && selectedGroup 
                    ? "cursor-pointer" 
                    : "cursor-not-allowed"} 
                  text-[var(--color-text-primary)] bg-white
                  ${!(expenseName.trim() && selectedGroup) || 
                  "hover:bg-[var(--color-button-hover)] hover:text-white"}
                `}
              >
                Custom
                <NavigateNextIcon/>
              </button>
              {error && (
                <p className="mt-2 text-xs text-[var(--color-error)]">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  } else if (page == 2) {
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
                Splitting Evenly
              </h3>
            </div>
            {/* Input */}
            <div className="mb-5">
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
                disabled={!expenseName.trim()}
                className={`
                  px-5 py-2.5 rounded-[6px] text-[14px] transition-all duration-200
                  ${expenseName.trim() ? "cursor-pointer" : "cursor-not-allowed"}
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
  } else {
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
                  Split Options for ${expenseDollars.toString()}.{expenseCents.toString().padEnd(2, "0")}
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
                disabled={!expenseName.trim()}
                className={`
                  px-5 py-2.5 rounded-[6px] text-[14px] transition-all duration-200
                  ${expenseName.trim() ? "cursor-pointer" : "cursor-not-allowed"}
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
  }
};
