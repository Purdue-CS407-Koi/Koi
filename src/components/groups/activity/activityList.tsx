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
}

interface Member {
  id: string;
  name: string;
  avatar?: string;
}

interface ActivityListProps {
  activityData?: Activity[];
  activityLoading: boolean;
  members: Member[];
}

export const ActivityList: React.FC<ActivityListProps> = ({
  activityData,
  activityLoading,
  members,
}) => {
  const [split, setSplit] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isYouOwe, setIsYouOwe] = useState(false);

  console.log(activityData);

  const handleModal = (activity: Activity, isYouOwe: boolean) => {
    setSplit(activity);
    setIsModalOpen(true);
    setIsYouOwe(isYouOwe);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

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
                  {members.find((g) => g.id === activity.original_payer)?.name ||
                    ""}{" "}
                  paid{" "}
                  <span className="font-bold">
                    ${activity.original_payment?.toFixed(2)}
                  </span>
                </div>
                <div className="flex-1 leading-normal text-sm items-baseline">
                  You owe{" "}
                  <span className="text-red-500 font-bold">
                    ${(activity.amount_owed ?? 0).toFixed(2)}
                  </span>
                  
                </div>
              </div>
            )}
          </div>
          {isModalOpen &&
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/25 flex items-center justify-center z-[1000]"
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
                  Here
                </div>
              </div>
            </>
          }
        </li>
      ))}
    </ul>
  );
};
