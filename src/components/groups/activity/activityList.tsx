import React from "react";

interface Activity {
  id: string;
  description?: string | null;
  created_at: string;
}

interface ActivityListProps {
  activityData?: Activity[];
  activityLoading: boolean;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  activityData,
  activityLoading,
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
            {activity.description || "Expense"}
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
