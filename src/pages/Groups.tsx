import { useState, useEffect } from "react";

import Template, { Content, Sidebar } from "@/templates/template";
import { GroupsList } from "@/components/groups/groupsList";
import { MembersList } from "@/components/groups/membersList";
import { AddGroupExpenseModal } from "@/components/groups/addGroupExpenseModal";
import type { NewExpense } from "@/interfaces/Expense";
import { insertNewExpense } from "@/api/expenses";
import useGroups from "@/hooks/useGroups";

const Groups = () => {
  const { groupsData } = useGroups(); 

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddGroupExpense = async (expense: NewExpense) => {
    const { id } = (await insertNewExpense(expense))[0];
    setIsModalOpen(false);
    return id;
  };
  // TODO: replace with members fetched from DB
  interface Member {
    id: string;
    name: string;
    avatar?: string;
  }
  const [members] = useState<Member[]>([
    { id: "1", name: "Sarr" },
    { id: "2", name: "Annie" },
    { id: "3", name: "Madison" },
    { id: "4", name: "Mich" },
  ]);

  return (
    <Template>
      <Content>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            backgroundColor: "#F0F1F6",
            padding: "24px",
          }}
        >
          {/* Single Large Panel */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                gap: "24px",
              }}
            >
              {/* Left Section - Expenses */}
              <div style={{ flex: 2 }}>
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
                    Roommates
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

                {/* Expenses List Placeholder */}
                <div>
                  {/* Expense items will go here */}
                  <div style={{ color: "#6b7280", fontStyle: "italic" }}>
                    Expense list items will be displayed here
                  </div>
                </div>
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
                <MembersList members={members} />
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
          onAddGroup={() => {}}
        />
      </Sidebar>
    </Template>
  );
};

export default Groups;
