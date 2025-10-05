import { useState } from "react";

import { Bookmark, BookmarkBorder } from "@mui/icons-material";

import type { Tables } from "@/helpers/supabase.types";
import { useBuckets } from "@/hooks/useBuckets";
import { useBucketsStore } from "@/stores/useBucketsStore";
import { getRecurrencePeriodDisplayName, RecurrencePeriodType } from "@/interfaces/Bucket";
import { capitalizeFirstLetter } from "@/helpers/utilities";

import BucketMoreActions from "./bucketMoreActions";
import NewBucketModal from "./newBucketModal";

const SortTypes = {
  NONE: "None",
  CREATION_DATE: "creation_date",
  NAME: "name",
  SPENDING_LIMIT: "spending_limit",
} as const;

type SortTypes = (typeof SortTypes)[keyof typeof SortTypes];

const sortTypeLabels = [
  { value: SortTypes.NONE, label: "Sort" },
  { value: SortTypes.CREATION_DATE, label: "Creation Date" },
  { value: SortTypes.NAME, label: "Name" },
  { value: SortTypes.SPENDING_LIMIT, label: "Spending Limit" },
] as const;

export const BucketList = () => {
  const [sortBy, setSortBy] = useState<SortTypes>(SortTypes.NONE);
  const [newModalOpen, setNewModalOpen] = useState(false);

  const { bucketMetadataData } = useBuckets();

  const { currentBucketMetadataId, setCurrentBucketMetadataId } =
    useBucketsStore();

  const SidebarTitle = () => {
    return (
      <h3 className="text-lg font-semibold mb-4 text-sidebar-title">Buckets</h3>
    );
  };

  const SortButton = () => {
    return (
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortTypes)}
        className="px-2 py-1 text-sm font-semibold rounded-3xl appearance-none bg-secondary-container text-on-secondary-container"
      >
        {sortTypeLabels.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };

  const BucketListItem = ({ bucket }: { bucket: Tables<"BucketMetadata"> }) => {
    return (
      <div
        key={bucket.id}
        className="flex flex-row items-center gap-3 py-2 cursor-pointer"
        onClick={() => {
          setCurrentBucketMetadataId(bucket.id);
        }}
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-5">
          {currentBucketMetadataId === bucket.id ? (
            <Bookmark />
          ) : (
            <BookmarkBorder />
          )}
        </div>
        {/* Name and Recurrence Period */}
        <div>
          <div className="text-sm font-medium text-sidebar-entry">
            {bucket.name}
          </div>
          <div className="text-xs text-sidebar-entry-subtext">
            {bucket.recurrence_period_type !== null
              ? capitalizeFirstLetter(
                  getRecurrencePeriodDisplayName(bucket.recurrence_period_type as RecurrencePeriodType)
                )
              : ""}
          </div>
        </div>
        {/* More actions */}
        <div className="ml-auto">
          <BucketMoreActions bucketMetadataId={bucket.id} />
        </div>
      </div>
    );
  };

  const NewBucketButton = () => {
    return (
      <button
        onClick={() => setNewModalOpen(true)}
        className={`flex items-center gap-2
              p-2 mt-2 rounded-md
              cursor-pointer text-sm
              border border-sidebar-button-border
              bg-transparent
              transition-all duration-200"
            `}
      >
        <span className="text-lg">+</span>
        Add New
      </button>
    );
  };

  // Process data
  let processedData = bucketMetadataData || [];
  // Check sorting step
  if (sortBy !== SortTypes.NONE) {
    switch (sortBy) {
      case SortTypes.CREATION_DATE:
        processedData = [...processedData].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case SortTypes.NAME:
        processedData = [...processedData].sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
        break;
      case SortTypes.SPENDING_LIMIT:
        processedData = [...processedData].sort(
          (a, b) => (b.spending_limit || 0) - (a.spending_limit || 0)
        );
        break;
    }
  }

  return (
    <>
      <div>
        <SidebarTitle />
        <SortButton />
        <div className="flex flex-col gap-2">
          {processedData
            ?.filter((bucket) => {
              return bucket.hidden_at === null;
            })
            .map((bucket: Tables<"BucketMetadata">) => (
              <BucketListItem key={bucket.id} bucket={bucket} />
            ))}
          <NewBucketButton />
        </div>
      </div>

      <NewBucketModal open={newModalOpen} setOpen={setNewModalOpen} />
    </>
  );
};
