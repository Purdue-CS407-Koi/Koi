import { useBuckets } from "@/hooks/useBuckets";
import useUserChallenges from "@/hooks/useChallenges";
import { useBucketsStore } from "@/stores/useBucketsStore";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";

interface Activity {
  id: string;
  name?: string | null;
  description?: string | null;
  created_at: string;
  amount_owed?: number | null;
  amount_remaining?: number | null;
  original_payer?: string | null;
  original_payment?: number | null;
  original_payer_name?: string | null;
}

interface ActivityListProps {
  activityData?: Activity[];
  activityLoading: boolean;
  settleSplit: (settle_split_id: string, bucket_instance_id: string) => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  activityData,
  activityLoading,
  settleSplit
}) => {
  const [split, setSplit] = useState<Activity>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const { bucketMetadataData, refetchBucketInstance } = useBuckets();
  const { setCurrentBucketMetadataId } =
    useBucketsStore();
  
  const { activeChallengeData } = useUserChallenges();

  const handleModal = (activity: Activity) => {
    setSplit(activity);
    setIsModalOpen(true);
  };

  const handleSettleSplit = async () => {
    const { data: refreshedInstances } = await refetchBucketInstance();
    const bucketInstanceId = refreshedInstances && (refreshedInstances[refreshedInstances.length - 1].id || undefined);
    if (bucketInstanceId) {
      await settleSplit(split?.id ?? "", bucketInstanceId ?? "");
      setIsModalOpen(false);
    }
  }

  if (activityLoading) {
    return <div className="text-loading">Loading activity...</div>;
  }

  if (!activityData || activityData.length === 0) {
    return (
      <div className="text-loading italic">
        No activity found
      </div>
    );
  }

  return (
    <ul className="list-none p-0 m-0">
      {activityData.map((activity) => (
        <li
          key={activity.id}
          className="cursor-pointer hover:bg-gray-200 p-3 border-b border-divider"
        >
          <div 
            className="flex items-center gap-3 relative z-10" 
            onClick={() => handleModal(activity)}
          >
            <div className="text-sm font-medium flex-2 leading-normal">
              {activity.name || "Expense"}
            </div>
            <div className="flex-1 text-xs mt-1 text-loading">
              {new Date(activity.created_at).toLocaleDateString()}
            </div>
            {(activity.amount_owed ?? 0) <= 0 ? (
              <div className="flex flex-4">
                <div className="flex-3 leading-normal text-sm items-baseline text-right pr-10">
                  You paid{" "}
                  <span className="font-bold">
                    ${activity.original_payment?.toFixed(2)}
                  </span>
                </div>
                {
                  (activity.amount_remaining ?? 0) == 0 ?
                  <div className="flex-2 leading-normal text-sm items-baseline">
                    Settled{" "}
                    <span className="text-[var(--color-positive-tertiary)] font-bold">
                        ${((activity.amount_owed ?? 0) * -1).toFixed(2)}
                    </span>
                  </div>
                  :
                  <div className="flex-2 flex flex-col">
                    <div className="leading-normal text-sm items-baseline">
                      You'll get back{" "}
                      <span className="text-[var(--color-positive-tertiary)] font-bold">
                        ${((activity.amount_owed ?? 0) * -1).toFixed(2)}
                      </span>
                    </div>
                    <div className="leading-normal text-[10px] items-baseline">
                      Still pending{" "}
                      <span className="text-[var(--color-positive-tertiary)] font-bold">
                        ${((activity.amount_remaining ?? 0) * -1).toFixed(2)}
                      </span>
                    </div>
                  </div>
                }
              </div>
            ) : (
              <div className="flex flex-4">
                <div className="flex-3 leading-normal text-sm items-baseline text-right pr-10">
                  {activity.original_payer_name ||
                    ""}{" "}
                  paid{" "}
                  <span className="font-bold">
                    ${activity.original_payment?.toFixed(2)}
                  </span>
                </div>
                {
                  (activity.amount_remaining ?? 0) == 0 ?
                  <div className="flex-2 leading-normal text-sm items-baseline">
                    Settled{" "}
                    <span className="text-[var(--color-positive-tertiary)] font-bold">
                      ${(activity.amount_owed ?? 0).toFixed(2)}
                    </span>
                  </div>
                  :
                  <div className="flex-2 leading-normal text-sm items-baseline">
                  You owe{" "}
                  <span className="text-red-500 font-bold">
                    ${(activity.amount_remaining ?? 0).toFixed(2)}
                  </span>
                </div>}
              </div>
            )}
          </div>
          
        </li>
      ))}
      <Dialog 
        open={isModalOpen}
        onClose={() => {
          setSelectedBucket("");
          setIsModalOpen(false);
        }}
        fullWidth
        maxWidth="xs"
      >
        {/* Header */}
        <DialogTitle>
          <h3 className="m-0 text-lg font-semibold text-black text-center" >
            Details
          </h3>
        </DialogTitle>

        {/* Input */}
        <DialogContent>
          {(split?.amount_owed ?? 0) <= 0 ?
            <div className="leading-normal flex flex-col mb-5 text-[var(--color-text-primary)]">
              <div className="text-lg">
                {split?.name}
              </div>
              <div className="text-2xl">
                ${split?.original_payment?.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">
                Added on {new Date(split?.created_at ?? "").toLocaleDateString()}
              </div>
              <div className="mt-4 text-xl">
                You paid ${split?.original_payment?.toFixed(2)}
              </div>
              <div>
                You are owed ${((split?.amount_remaining ?? 0) * -1).toFixed(2)}
              </div>
            </div>
            :
            <div className="leading-normal flex flex-col text-[var(--color-text-primary)]">
              <div className="text-xl">
                {split?.name}
              </div>
              <div className="text-2xl">
                ${split?.original_payment?.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">
                Added on {new Date(split?.created_at ?? "").toLocaleDateString()}
              </div>
              <div className="mt-4 text-xl">
                {split?.original_payer_name ?? "unknown"} paid ${split?.original_payment?.toFixed(2)}
              </div>
              <div className="mb-5">
                You owe ${split?.amount_remaining?.toFixed(2)}
              </div>
              {split?.amount_remaining == 0 ||
                <div>
                  <FormControl fullWidth 
                    required
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
                      ))
                    }
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
                    <InputLabel id="challenge-label">
                      Select Challenge
                    </InputLabel>
                    <Select
                      margin="dense"
                      labelId="challenge-label"
                      label="Select Challenge"
                      value={selectedChallenge}
                      onChange={(e) => {
                        setSelectedChallenge(e.target.value);
                      }}
                      fullWidth
                      required
                    >
                    <MenuItem value="" className="text-gray-500">(No Challenge)</MenuItem>
                    {activeChallengeData
                      ?.map((ch) => (              
                        <MenuItem key={ch.id} value={ch.id}>
                          {ch.name}
                        </MenuItem>
                        )
                      )
                    }
                    </Select>
                  </FormControl>
                </div>
              }
              
              <DialogActions>
                <Button
                  onClick={() => {
                    setSelectedBucket("");
                    setIsModalOpen(false);
                  }}
                  className={`
                    !text-[var(--color-text-primary)] !pl-3
                  `}
                >
                  Close
                </Button>
                {split?.amount_remaining == 0 ||
                  <Button
                    disabled={!(selectedBucket.trim())}
                    onClick={handleSettleSplit}
                    className={`
                      !text-[var(--color-text-primary)] !bg-[var(--color-primary-container)] !pl-3
                      hover:!bg-[var(--color-button-hover)] hover:!text-white
                      ${selectedBucket
                      ? "!cursor-pointer" 
                      : "!cursor-not-allowed"} 
                    `}
                  >
                    Settle Up
                  </Button>
                }
              </DialogActions>
            </div>
          }
        </DialogContent>
      </Dialog>
    </ul>
  );
};
