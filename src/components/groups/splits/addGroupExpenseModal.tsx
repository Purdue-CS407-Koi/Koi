import React, { useState } from "react";

// constants
import { TEXT_EDITING } from "@/config/keyboardEvents";

// hooks
import useGroups from "@/hooks/useGroups";
import useUsers from "@/hooks/useUsers";
import { useBuckets } from "@/hooks/useBuckets";
import { useBucketsStore } from "@/stores/useBucketsStore";

// components
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

//types
import type { TablesInsert } from "@/helpers/supabase.types";

interface AddGroupExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (page: number) => void; 
  setExpense: (expense: TablesInsert<"Expenses">) => void;
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
}

export const AddGroupExpenseModal: React.FC<AddGroupExpenseModalProps> = ({
  isOpen,
  onClose,
  onNext,
  setExpense,
  selectedGroup,
  setSelectedGroup
}) => {
  const { groupsData: groups } = useGroups();
  const { bucketMetadataData, refetchBucketInstance } = useBuckets();
  const { userData } = useUsers();
  
  const [expenseName, setExpenseName] = useState("");
  const [expenseDollars, setExpenseDollars] = useState("00");
  const [expenseCents, setExpenseCents] = useState("00");
  // const [expenseDescription, setExpenseDescription] = useState("");
  const [selectedBucket, setSelectedBucket] = useState("");

  const { setCurrentBucketMetadataId } =
    useBucketsStore();

  const [error, setError] = useState("");

  const resetToDefault = () => {
    setExpenseName("");
    setExpenseDollars("00");
    setExpenseCents("00");
    setSelectedGroup("");
    setSelectedBucket("");
  };

  const handleSplitEvenly = async () => {
    if (!expenseName.trim() || !selectedGroup) {
      setError("Expense name/group is required");
      return;
    }
    setError("");

    const amount = Number(expenseDollars) + Number(expenseCents) / 100;
    const name = expenseName;
    const user_id = userData?.id;
    // const description = expenseDescription;
    const { data: refreshedInstances } = await refetchBucketInstance();

    setExpense({
      amount,
      name,
      user_id,
      bucket_instance_id: refreshedInstances && (refreshedInstances[0].id || undefined),
    });

    onNext(2);
  };

  const handleCustomAmounts = async () => {
    if (!expenseName.trim() || !selectedGroup) {
      setError("Expense name/group is required");
      return;
    }
    setError("");

    const amount = Number(expenseDollars) + Number(expenseCents) / 100;
    const name = expenseName;
    const user_id = userData?.id;
    const { data: refreshedInstances } = await refetchBucketInstance();

    setExpense({
      amount,
      name,
      user_id,
      bucket_instance_id: refreshedInstances && (refreshedInstances[0].id || undefined),
    });

    onNext(3);
  };

  const handleClose = () => {
    setError("");
    resetToDefault();
    onClose();
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
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value) }
              className={`
                mt-2 p-1.5 text-sm outline-none box-border border-b-2 transition-colors duration-200 text-center 
                ${error ? "border-red-500" : "border-gray-500"} 
                ${selectedGroup.trim() ? "text-black" : "text-gray-600"}
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

            <select
              value={selectedBucket}
              onChange={(e) => {
                setSelectedBucket(e.target.value);
                setCurrentBucketMetadataId(e.target.value);
              }}
              className={`
                mt-2 p-1.5 text-sm outline-none box-border border-b-2 transition-colors duration-200 text-center 
                ${error ? "border-red-500" : "border-gray-500"} 
                ${selectedBucket.trim() ? "text-black" : "text-gray-600"}
              `}
            >
              {/* Placeholder */}
              <option value="" disabled hidden>
                Select a Bucket
              </option>

              {bucketMetadataData?.map(
                (bucket) => (
                  <option key={bucket.id} value={bucket.id}>
                    {bucket.name}
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
                ${expenseName.trim() && selectedGroup && selectedBucket
                  ? "cursor-pointer" 
                  : "cursor-not-allowed"} 
                text-[var(--color-text-primary)] bg-white
                ${!(expenseName.trim() && selectedGroup && selectedBucket) || 
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
                ${expenseName.trim() && selectedGroup && selectedBucket
                  ? "cursor-pointer" 
                  : "cursor-not-allowed"} 
                text-[var(--color-text-primary)] bg-white
                ${!(expenseName.trim() && selectedGroup && selectedBucket) || 
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
};
