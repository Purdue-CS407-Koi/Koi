import React, { useState } from "react";
import { AddBucketModal } from "./addBucketModal";

import type {BucketMetadata} from "@/interfaces/Bucket";

interface BucketsListProps {
  buckets: BucketMetadata[];
  onAddBucket: (bucketName: string) => void;
}

export const BucketsList: React.FC<BucketsListProps> = ({
  buckets,
  onAddBucket,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getBucketIcon = () => {
    // Bookmark icon for all groups
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    );
  };

  const handleAddBucket = (bucketName: string) => {
    onAddBucket(bucketName);
    setIsModalOpen(false);
  };

  return (
    <>
      <div>
        <h3 className="text-lg font-semibold mb-4 text-sidebar-title">
          Buckets
        </h3>
        <div className="flex flex-col gap-2">
          {buckets.map((bucket) => (
            <div
              key={bucket.id}
              className="flex items-center gap-3 py-2"
            >
              <div className="flex items-center justify-center w-5">
                {getBucketIcon()}
              </div>
              <div>
                <div className="text-sm font-medium text-sidebar-entry">
                  {bucket.name}
                </div>
                <div className="text-xs text-sidebar-entry-subtext">
                  {/* TODO: pretty print this like "Recurs every month", use switch! */}
                  {bucket.recurrence_period_type
                    ? `Recurrence: ${bucket.recurrence_period_type}`
                    : ""}
                </div>
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

      {/* Modal */}
      <AddBucketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddBucket}
      />
    </>
  );
};