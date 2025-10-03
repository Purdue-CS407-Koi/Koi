import { useState } from "react";
import NewBucketModal from "./newBucketModal";
import { useBuckets } from "@/hooks/useBuckets";

import { Bookmark, BookmarkBorder, MoreVert } from "@mui/icons-material";
import { useBucketsStore } from "@/stores/useBucketsStore";
import { getRecurrencePeriodDisplayName } from "@/interfaces/Bucket";
import { capitalizeFirstLetter } from "@/helpers/utilities";
import { IconButton } from "@mui/material";
import BucketMoreActions from "./bucketMoreActions";


export const BucketsList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { bucketMetadataData } = useBuckets();

  const { currentBucketMetadataId, setCurrentBucketMetadataId } = useBucketsStore();

  return (
    <>
      <div>
        <h3 className="text-lg font-semibold mb-4 text-sidebar-title">
          Buckets
        </h3>
        <div className="flex flex-col gap-2">
          {bucketMetadataData?.map((bucket) => (
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
                        getRecurrencePeriodDisplayName(
                          bucket.recurrence_period_type
                        )
                      )
                    : ""}
                </div>
              </div>
              {/* More actions */}
              <div className="ml-auto">
                <BucketMoreActions />
              </div>
            </div>
          ))}
          <button
            onClick={() => setIsModalOpen(true)}
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
        </div>
      </div>

      <NewBucketModal open={isModalOpen} setOpen={setIsModalOpen} />
    </>
  );
};