import { useState } from "react";
import useGroups from "@/hooks/useGroups";
import { GroupsList } from "@/components/groups/groupsList";
import { MembersList } from "@/components/groups/membersList";
import Template, { Content, Sidebar } from "@/templates/template";
import { AddGroupExpenseModal } from "@/components/groups/addGroupExpenseModal";
import type { NewExpense } from "@/interfaces/Expense";
import { insertNewExpense } from "@/api/expenses";
import { getGroupMembers } from "@/api/groups";
import { ActivityList } from "@/components/groups/activity/activityList";

interface Member {
  id: string;
  name: string;
  avatar?: string;
}

const Groups = () => {
  const { groupsData, useActivity } = useGroups();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [, setIsEditModalOpen] = useState(false);
  const { data: activityData, isLoading: activityLoading } = useActivity(
    selectedGroupId ?? undefined
  );
  const selectedGroupName =
    groupsData?.find((g) => g.id === selectedGroupId)?.name || "";

  const handleSelectGroup = async (groupId: string, groupName: string) => {
    setSelectedGroupId(groupId);

    try {
      const groupMembers = await getGroupMembers(groupId);
      setMembers(groupMembers);
    } catch (error) {
      console.error("Failed to fetch group members:", error);
      setMembers([]);
    }
  };

  const handleAddGroupExpense = async (expense: NewExpense) => {
    const { id } = (await insertNewExpense(expense))[0];
    setIsModalOpen(false);
    return id;
  };

  console.log(activityData);

  const handleEditGroup = () => {
    setIsEditModalOpen(true);
  };

  return (
    <Template>
      <Content>
        <div
          className="flex min-h-screen p-6"
          style={{
            backgroundColor: "#F0F1F6",
          }}
        >
          {/* Single Large Panel */}
          <div className="flex-1">
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                gap: "24px",
              }}
            >
              {/* Left Section */}
              <div className="flex-2">
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    {selectedGroupName || "Select a Group"}
                  </h2>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 16px",
                        backgroundColor: "#8b5cf6",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>+</span>
                      Add Expense
                    </button>
                  </div>
                </div>
                <ActivityList
                  activityData={activityData}
                  activityLoading={activityLoading}
                  members={members}
                />
              </div>

              {/* Vertical Divider Line */}
              <div
                style={{
                  width: "1px",
                  backgroundColor: "#e5e7eb",
                  alignSelf: "stretch",
                }}
              />

              <div style={{ flex: 1 }}>
                <MembersList members={members} />{" "}
              </div>

              {/* Modal */}
              <AddGroupExpenseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddGroupExpense}
              />
            </div>
          </div>
        </div>
      </Content>
      <Sidebar>
        <GroupsList
          groups={(groupsData ?? []).map((g) => ({
            id: g.id,
            name: g.name,
            createdDate: new Date(g.created_at).toLocaleDateString(),
          }))}
          selectedGroupId={selectedGroupId}
          onSelectGroup={handleSelectGroup}
          onEditGroup={handleEditGroup}
        />
      </Sidebar>
      <AddGroupExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddGroupExpense}
      />
    </Template>
  );
};

export default Groups;
