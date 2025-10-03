import React, { act } from "react";

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
  
  if (members.length != 0) {
    return (
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {activityData.map((activity) => (
          <li
            key={activity.id}
            className="flex items-center gap-3"
            style={{
              padding: "12px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 500 }} className="flex-1">
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
            {(activity.amount_owed ?? 0) < -1 ? 
              <div className="flex flex-2">
                <div className="flex-1 leading-normal text-sm items-baseline">
                  You paid {" "}
                  <span className="font-bold">${activity.original_payment?.toFixed(2)}</span>
                </div>
                <div className="flex-1 leading-normal text-sm items-baseline">
                  You'll get back {" "}
                  <span className="text-green-500 font-bold">${((activity.amount_owed ?? 0)  * -1).toFixed(2)}</span>
                </div>
              </div>
            :
              <div className="flex flex-2">
                <div className="flex-1 leading-normal text-sm items-baseline">
                  {members.find((g) => g.id === activity.original_payer)?.name || ""} paid {" "}
                  <span className="font-bold">${activity.original_payment?.toFixed(2)}</span>
                </div>
                <div className="flex-1 leading-normal text-sm items-baseline">
                  You owe {" "}
                  <span className="text-red-500 font-bold">${((activity.amount_owed ?? 0)).toFixed(2)}</span>
                </div>
              </div>
            }
          </li>
        ))}
      </ul>
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
          <div style={{ fontSize: "14px", fontWeight: 500 }}>
            {activity.name || "Expense"}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#6b7280",
              marginTop: "4px",
            }}
          >
            {new Date(activity.created_at).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  );
};
