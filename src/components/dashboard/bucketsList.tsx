import React, { useState } from "react";
import { AddBucketModal } from "./addBucketModal";
import type Bucket from "../../interfaces/Bucket";

interface BucketsListProps {
  buckets: Bucket[];
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
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "16px",
            color: "#111827",
          }}
        >
          Buckets
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {buckets.map((bucket) => (
            <div
              key={bucket.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "20px",
                }}
              >
                {getBucketIcon()}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#111827",
                  }}
                >
                  {bucket.name}
                </div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px",
              background: "none",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              cursor: "pointer",
              color: "#6b7280",
              fontSize: "14px",
              marginTop: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f9fafb";
              e.currentTarget.style.borderColor = "#9ca3af";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "#d1d5db";
            }}
          >
            <span style={{ fontSize: "18px" }}>+</span>
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