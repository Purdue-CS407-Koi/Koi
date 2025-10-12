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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Typography,
} from "@mui/material";

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
  setSelectedGroup,
}) => {
  const { groupsData: groups } = useGroups();
  const { bucketMetadataData, refetchBucketInstance } = useBuckets();
  const { userData } = useUsers();
  
  const [expenseName, setExpenseName] = useState("");
  const [expenseDollars, setExpenseDollars] = useState("00");
  const [expenseCents, setExpenseCents] = useState("00");
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
    const { data: refreshedInstances } = await refetchBucketInstance();

    setExpense({
      amount,
      name,
      user_id,
      bucket_instance_id: refreshedInstances && (refreshedInstances[refreshedInstances.length - 1].id || undefined),
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
      bucket_instance_id: refreshedInstances && (refreshedInstances[refreshedInstances.length - 1].id || undefined),
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
          Create New Group Expense
        </h3>
      </DialogTitle>

      {/* Input */}
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          value={expenseName}
          label="Expense Name"
          onChange={(e) => {
            setExpenseName(e.target.value);
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

        <FormControl fullWidth 
          className="
            [&_.MuiInputLabel-root]:!text-gray-500
            [&_.MuiInputLabel-root.Mui-focused]:!text-[var(--color-button-hover)]
            [&_.MuiOutlinedInput-notchedOutline]:!border-gray-300
            [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:!border-[var(--color-button-hover)]
            [&_.MuiSelect-select]:!text-gray-800
            [&_.MuiSvgIcon-root]:!text-[var(--color-button-hover)]]
            !mb-4
          "     
        >
          <InputLabel id="group-label">
            Select Group
          </InputLabel>
          <Select
            margin="dense"
            labelId="group-label"
            label="Select Group"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value) }
            fullWidth
            required
          >
            {groups?.map((group: { id: string; name: string; created_at: string }) => (
              <MenuItem value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
          
        </FormControl>

        <FormControl fullWidth 
          className="
            [&_.MuiInputLabel-root]:!text-gray-500
            [&_.MuiInputLabel-root.Mui-focused]:!text-[var(--color-button-hover)]
            [&_.MuiOutlinedInput-notchedOutline]:!border-gray-300
            [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:!border-[var(--color-button-hover)]
            [&_.MuiSelect-select]:!text-gray-800
            [&_.MuiSvgIcon-root]:!text-[var(--color-button-hover)]]
            !mb-4
          "     
        >
          <InputLabel id="bucket-label">
            Select Bucket
          </InputLabel>
          <Select
            margin="dense"
            labelId="bucket-label"
            label="Select Bucket"
            value={selectedBucket}
            onChange={(e) => {
              setSelectedBucket(e.target.value);
              setCurrentBucketMetadataId(e.target.value);
            }}
            fullWidth
            required
          >
          {bucketMetadataData
            ?.filter((bucket) => {
              return bucket.hidden_at === null;
            })?.map((bucket) => (              
              <MenuItem key={bucket.id} value={bucket.id}>
                {bucket.name}
              </MenuItem>
              )
            )
          }
          </Select>
        </FormControl>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" component="span">
            $
          </Typography>
          <TextField
            variant="standard"
            value={expenseDollars}
            onChange={(e) => {
              setExpenseDollars(e.target.value);
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
            value={expenseCents}
            onChange={(e) => {
              const v = e.target.value.slice(0, 2); // max 2 chars
              setExpenseCents(v);
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
      <DialogActions className="!flex !gap-1 !items-center !flex-col !mb-2">
        <div className="mt-6 leading-normal w-30">
          Split:
        </div>
        <Button
          onClick={handleSplitEvenly}
          className={`
            ${expenseName.trim() && selectedGroup && selectedBucket
              ? "!cursor-pointer" 
              : "!cursor-not-allowed"} 
            !text-[var(--color-text-primary)] !bg-white !pl-3
            ${!(expenseName.trim() && selectedGroup && selectedBucket) || 
            "hover:!bg-[var(--color-button-hover)] hover:!text-white"}
          `}
        >
          Evenly
          <NavigateNextIcon/>
        </Button>
        <Button
          onClick={handleCustomAmounts}
          className={`
            ${expenseName.trim() && selectedGroup && selectedBucket
              ? "!cursor-pointer" 
              : "!cursor-not-allowed"} 
            !text-[var(--color-text-primary)] !bg-white !pl-3
            ${!(expenseName.trim() && selectedGroup && selectedBucket) || 
            "hover:!bg-[var(--color-button-hover)] hover:!text-white"}
          `}
        >
          Custom
          <NavigateNextIcon/>
        </Button>
      </DialogActions>
    </Dialog>
  );
};
