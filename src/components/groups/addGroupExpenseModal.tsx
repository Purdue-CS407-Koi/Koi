import React, { useEffect, useState } from "react";

// constants
import {
  BLACK,
  BUTTON_COLOR,
  BUTTON_HOVER_COLOR,
  TEXT_COLOR,
  WHITE,
} from "@/config/colors";
import { TEXT_EDITING } from "@/config/keyboardEvents";

// hooks
import useGroups from "@/hooks/useGroups";
import useSplits from "@/hooks/useSplits";
import useUsers from "@/hooks/useUsers";

// components
import { MinusIcon } from "@/components/general/minusIcon";
import { PlusIcon } from "@/components/general/plusIcon";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

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
      setError("Expense name is required");
      return;
    }
    setPage(2);
    return;
  };

  const handleCustomAmounts = () => {
    if (!expenseName.trim() || !selectedGroup) {
      setError("Expense name is required");
      return;
    }
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
        }
      });
    } else {
      let totalCents = 0;

      Object.values(individualAmounts).forEach(({ dollars, cents }) => {
        const d = parseInt(dollars || "0", 10);
        const c = parseInt(cents || "0", 10);
        totalCents += d * 100 + c;
      });

      const amount = Math.floor(totalCents / 100) + (totalCents % 100);
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
        }
      });
    }

    if (!expenseName.trim()) {
      setError("Expense name is required");
      return;
    }
    handleClose();
  };

  const handleMode = () => {
    setPayers(members ?? []);
    handleEvenSplit();
    setSplitting(!splitting);
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
    const newAmounts: { [key: string]: { dollars: string; cents: string } } =
      {};
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
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={handleClose}
        >
          {/* Modal */}
          <div
            className="relative"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "48px 24px 24px 24px",
              width: "100%",
              maxWidth: "400px",
              margin: "16px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className ="absolute top-1 left-1"
              onClick={handleClose}
              style={{
                padding: "10px 10px",
                borderRadius: "6px",
                backgroundColor: "white",
                color: "#374151",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f9fafb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              Cancel
            </button>
            
            {/* Header */}
            <div style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                Create New Group Expense
              </h3>
            </div>

            {/* Input */}
            <div style={{ marginBottom: "20px" }} className="flex flex-col items-center">
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
                style={{
                  width: "70%",
                  padding: "6px",
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
              />

              <select
                value={selectedGroup ?? ""}
                onChange={(e) =>
                  setSelectedGroup(
                    e.target.value === "" ? null : e.target.value
                  )
                }
                style={{
                  padding: "6px",
                  borderBottom: error ? "2px solid #ef4444" : "2px solid #757981ff",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                  textAlign: "center",
                  color: selectedGroup ? BLACK : TEXT_COLOR,
                }}
                className="mt-4"
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
                  style={{
                    width: "calc(4em + 8px)",
                    padding: "2px",
                    borderBottom: error ? "2px solid #ef4444" : "2px solid #757981ff",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                    textAlign: "right",
                    minWidth: "calc(4em + 8px)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = error
                      ? "#ef4444"
                      : "#3b82f6";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = error
                      ? "#ef4444"
                      : "#757981ff";
                  }}
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
                  style={{
                    width: "calc(2em)",
                    padding: "2px",
                    borderBottom: error ? "2px solid #ef4444" : "2px solid #757981ff",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                    minWidth: "calc(2em)"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = error
                      ? "#ef4444"
                      : "#3b82f6";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = error
                      ? "#ef4444"
                      : "#757981ff";
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>
              <div className="mt-6 leading-normal w-30">
                Split:
              </div>
              <button
                className="flex flex-row justify-center items-center"
                onClick={handleSplitEvenly}
                style={{
                  padding: "2px 5px 2px 10px",
                  border: "none",
                  borderRadius: "6px",
                  color: TEXT_COLOR,
                  fontSize: "14px",
                  cursor:
                    expenseName.trim() && selectedGroup
                      ? "pointer"
                      : "not-allowed",
                  transition: "all 0.2s",
                  backgroundColor: WHITE,
                }}
                onMouseEnter={(e) => {
                  if (expenseName.trim() && selectedGroup) {
                    e.currentTarget.style.backgroundColor = BUTTON_HOVER_COLOR;
                    e.currentTarget.style.color = WHITE;
                  }
                }}
                onMouseLeave={(e) => {
                  if (expenseName.trim() && selectedGroup) {
                    e.currentTarget.style.backgroundColor = WHITE;
                    e.currentTarget.style.color = TEXT_COLOR;
                  }
                }}
              >
                Evenly
                <NavigateNextIcon/>
              </button>
              <button
                className="flex flex-row justify-center items-center"
                onClick={handleCustomAmounts}
                disabled={!expenseName.trim() || !selectedGroup}
                style={{
                  padding: "2px 5px 2px 10px",
                  border: "none",
                  borderRadius: "6px",
                  color: TEXT_COLOR,
                  fontSize: "14px",
                  cursor:
                    expenseName.trim() && selectedGroup
                      ? "pointer"
                      : "not-allowed",
                  transition: "all 0.2s",
                  backgroundColor: WHITE,
                }}
                onMouseEnter={(e) => {
                  if (expenseName.trim() && selectedGroup) {
                    e.currentTarget.style.backgroundColor = BUTTON_HOVER_COLOR;
                    e.currentTarget.style.color = WHITE;
                  }
                }}
                onMouseLeave={(e) => {
                  if (expenseName.trim() && selectedGroup) {
                    e.currentTarget.style.backgroundColor = WHITE;
                    e.currentTarget.style.color = TEXT_COLOR;
                  }
                }}
              >
                Custom
                <NavigateNextIcon/>
              </button>
              {error && (
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: "12px",
                    color: "#ef4444",
                  }}
                >
                  {error}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
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
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={handleClose}
        >
          {/* Modal */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              width: "100%",
              maxWidth: "400px",
              margin: "16px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                Create New Group Expense
              </h3>
            </div>
            <div>
              <button
                onClick={handleMode}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #d1d5db",
                  borderTopLeftRadius: "6px",
                  borderBottomLeftRadius: "6px",
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  backgroundColor: splitting ? BUTTON_COLOR : WHITE,
                  color: TEXT_COLOR,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  width: "50%",
                }}
              >
                Split Evenly
              </button>
              <button
                onClick={handleMode}
                disabled={!expenseName.trim() || !selectedGroup}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #d1d5db",
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  backgroundColor: !splitting ? BUTTON_COLOR : WHITE,
                  color: TEXT_COLOR,
                  fontSize: "14px",
                  cursor:
                    expenseName.trim() && selectedGroup
                      ? "pointer"
                      : "not-allowed",
                  transition: "all 0.2s",
                  width: "50%",
                }}
              >
                Custom Amounts
              </button>
            </div>
            {/* Input */}
            <div style={{ marginBottom: "20px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "8px",
                      marginTop: "12px",
                    }}
                  >
                    Expense Amount
                  </label>
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
                    style={{
                      width: "calc(4em + 8px)",
                      padding: "6px",
                      border: error ? "2px solid #ef4444" : "2px solid #757981ff",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                      textAlign: "right",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = error
                        ? "#ef4444"
                        : "#3b82f6";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = error
                        ? "#ef4444"
                        : "#757981ff";
                    }}
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
                    style={{
                      width: "calc(4em + 8px)",
                      padding: "6px",
                      border: error ? "2px solid #ef4444" : "2px solid #757981ff",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = error
                        ? "#ef4444"
                        : "#3b82f6";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = error
                        ? "#ef4444"
                        : "#757981ff";
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <button
                    onClick={handleEvenSplit}
                    style={{
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "6px",
                      color: TEXT_COLOR,
                      fontSize: "14px",
                      transition: "all 0.2s",
                      marginLeft: "10px",
                    }}
                  >
                    Calculate
                  </button>
                  <ul>
                    {payers?.map((m) => (
                      <li key={m.id} className="p-3 flex items-center gap-3">
                        {m.id == userData?.id ? (
                          <div>
                            {"(Paid by) " + m.name}
                            {`: ${individualAmounts[m.id]?.dollars ?? "00"}.${individualAmounts[m.id]?.cents ?? "00"}`}
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              className="... px-2 py-1 p-0 !p-1 !px-1 !py-1"
                              onClick={() => removePayer(m.id, m.name)}
                            >
                              <MinusIcon className="h-4 w-4" />
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
                          className="... px-2 py-1 p-0 !p-1 !px-1 !py-1"
                          onClick={() => addPayer(m.id, m.name)}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                        <div className="text-gray-400">
                          {m.name ?? "Unnamed user"}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              {error && (
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: "12px",
                    color: "#ef4444",
                  }}
                >
                  {error}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleBack}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  backgroundColor: "white",
                  color: "#374151",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={!expenseName.trim()}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  color: TEXT_COLOR,
                  fontSize: "14px",
                  cursor: expenseName.trim() ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (expenseName.trim()) {
                    e.currentTarget.style.backgroundColor = BUTTON_HOVER_COLOR;
                    e.currentTarget.style.color = WHITE;
                  }
                }}
                onMouseLeave={(e) => {
                  if (expenseName.trim()) {
                    e.currentTarget.style.backgroundColor = BUTTON_COLOR;
                    e.currentTarget.style.color = TEXT_COLOR;
                  }
                }}
              >
                Create Expense
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else {
<>
        {/* Backdrop */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={handleClose}
        >
          {/* Modal */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              width: "100%",
              maxWidth: "400px",
              margin: "16px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                Create New Group Expense
              </h3>
            </div>
            
            {/* Input */}
            <div style={{ marginBottom: "20px" }}>
            
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                    marginTop: "12px",
                  }}
                >
                  Expense Amount
                </label>
                <ul>
                  {members?.map((m) => (
                    <li key={m.id} className="flex items-center gap-3">
                      <div className="px-2 py-1 rounded flex items-center">
                        <div>
                          {m.id == userData?.id
                            ? "(Paid by) " + m.name
                            : m.name}
                          : $
                        </div>
                        <div>
                          <input
                            type="text"
                            value={individualAmounts[m.id]?.dollars}
                            onChange={(e) => {
                              setAmount(m.id, { dollars: e.target.value });
                              if (error) setError(""); // Clear error when user types
                            }}
                            onKeyDown={handleKeyPressNumber}
                            placeholder="00"
                            style={{
                              width: "calc(4em + 8px)",
                              padding: "6px",
                              border: error
                                ? "2px solid #ef4444"
                                : "2px solid #757981ff",
                              borderRadius: "8px",
                              fontSize: "14px",
                              outline: "none",
                              transition: "border-color 0.2s",
                              boxSizing: "border-box",
                              textAlign: "right",
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = error
                                ? "#ef4444"
                                : "#3b82f6";
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = error
                                ? "#ef4444"
                                : "#757981ff";
                            }}
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
                            style={{
                              width: "calc(4em + 8px)",
                              padding: "6px",
                              border: error
                                ? "2px solid #ef4444"
                                : "2px solid #757981ff",
                              borderRadius: "8px",
                              fontSize: "14px",
                              outline: "none",
                              transition: "border-color 0.2s",
                              boxSizing: "border-box",
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = error
                                ? "#ef4444"
                                : "#3b82f6";
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = error
                                ? "#ef4444"
                                : "#757981ff";
                            }}
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              {error && (
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: "12px",
                    color: "#ef4444",
                  }}
                >
                  {error}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleBack}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  backgroundColor: "white",
                  color: "#374151",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={!expenseName.trim()}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  color: TEXT_COLOR,
                  fontSize: "14px",
                  cursor: expenseName.trim() ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (expenseName.trim()) {
                    e.currentTarget.style.backgroundColor = BUTTON_HOVER_COLOR;
                    e.currentTarget.style.color = WHITE;
                  }
                }}
                onMouseLeave={(e) => {
                  if (expenseName.trim()) {
                    e.currentTarget.style.backgroundColor = BUTTON_COLOR;
                    e.currentTarget.style.color = TEXT_COLOR;
                  }
                }}
              >
                Create Expense
              </button>
            </div>
          </div>
        </div>
      </>
  }
};
