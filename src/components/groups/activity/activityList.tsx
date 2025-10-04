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
  settleSplit: (settle_split_id: string) => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  activityData,
  activityLoading,
  settleSplit
}) => {
  const [split, setSplit] = useState<Activity>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  console.log(activityData);

  const handleModal = (activity: Activity, isYouOwe: boolean) => {
    setSplit(activity);
    setIsModalOpen(true);
  };

  const handleSettleSplit = async () => {
    await settleSplit(split?.id ?? "")
    setIsModalOpen(false);
  }

  if (activityLoading) {
    return <div style={{ color: "#6b7280" }}>Loading activity...</div>;
  }

  if (!activityData || activityData.length === 0) {
    return (
      <div style={{ color: "#6b7280", fontStyle: "italic" }}>
        No activity found
      </div>
    );
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {activityData.map((activity) => (
        <li
          key={activity.id}
          className="cursor-pointer hover:bg-gray-200"
          style={{
            padding: "12px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div 
            className="flex items-center gap-3" 
            onClick={() => handleModal(activity, (activity.amount_owed ?? 0) <= 0)}
          >
            <div style={{ fontSize: "14px", fontWeight: 500 }} className="flex-1 leading-normal">
              {activity.name || "Expense"}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#6b7280",
                marginTop: "4px",
              }}
              className="flex-1"
            >
              {new Date(activity.created_at).toLocaleDateString()}
            </div>
            {(activity.amount_owed ?? 0) <= 0 ? (
              <div className="flex flex-4">
                <div className="flex-1 leading-normal text-sm items-baseline">
                  You paid{" "}
                  <span className="font-bold">
                    ${activity.original_payment?.toFixed(2)}
                  </span>
                </div>
                <div className="flex-1 leading-normal text-sm items-baseline">
                  You'll get back{" "}
                  <span className="text-green-500 font-bold">
                    ${((activity.amount_owed ?? 0) * -1).toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-4">
                <div className="flex-1 leading-normal text-sm items-baseline">
                  {activity.original_payer_name ||
                    ""}{" "}
                  paid{" "}
                  <span className="font-bold">
                    ${activity.original_payment?.toFixed(2)}
                  </span>
                </div>
                <div className="flex-1 leading-normal text-sm items-baseline">
                  You owe{" "}
                  <span className="text-red-500 font-bold">
                    ${(activity.amount_remaining ?? 0).toFixed(2)}
                  </span>
                  
                </div>
              </div>
            )}
          </div>
          
        </li>
      ))}
      {isModalOpen &&
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Modal */}
            <div
              className="relative bg-white rounded-xl px-12 py-6 w-full max-w-[400px] m-4 shadow-[0_10px_25px_rgba(0,0,0,0.1)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* <button
                className ="absolute top-1 left-1 px-2.5 py-1 rounded-md bg-white text-[#374151] text-sm cursor-pointer transition-all duration-200"
                onClick={handleClose}
              >
                Cancel
              </button> */}
              
              {/* Header */}
              <div className="mb-5">
                <h3 className="m-0 text-lg font-semibold text-black text-center" >
                  Details
                </h3>
              </div>
  
              {/* Input */}
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
                  <div className="justify-center flex">
                    <button
                      onClick={handleSettleSplit}
                      className={`
                        px-5 py-2.5 rounded-[6px] text-[14px] transition-all duration-200
                        w-auto hover:bg-[var(--color-button-hover)] hover:text-white rounded-full
                        text-[var(--color-text-primary)]
                      `}
                    >
                      Settle Up
                    </button>
                  </div>
                </div>
              }
              {error && (
                <p className="mt-2 text-xs text-[var(--color-error)]">
                  {error}
                </p>
              )}
            </div>
          </div>
        </>
      }
    </ul>
  );
};
