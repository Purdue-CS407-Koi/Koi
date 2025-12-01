import { useState } from "react";
import useGroups from "@/hooks/useGroups";
import useExpenses from "@/hooks/useExpenses";
import { GroupsList } from "@/components/groups/groupsList";
import { MembersList } from "@/components/groups/membersList";
import Template, { Content, Sidebar } from "@/templates/template";
import { AddGroupExpenseModal } from "@/components/groups/splits/addGroupExpenseModal";
import { ActivityList } from "@/components/groups/activity/activityList";
import { SplitEvenlyModal } from "@/components/groups/splits/splitEvenlyModal";
import { SplitCustomModal } from "@/components/groups/splits/splitCustomModal";
import type { TablesInsert } from "@/helpers/supabase.types";

const Groups = () => {
  const { groupsData, useActivity, settleSplit, useGroupMembers } = useGroups();

  const [modalPage, setModalPage] = useState(0);

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const { groupMembersData } = useGroupMembers(selectedGroupId ?? "");

  const [page1Reset, setPage1Reset] = useState(0);

  const [expense, setExpense] = useState<TablesInsert<"Expenses"> | null>(null);
  const [, setIsEditModalOpen] = useState(false);
  
  const {
    data: activityData,
    isLoading: activityLoading,
    refetch,
  } = useActivity(selectedGroupId ?? undefined);

  const { insertNewExpenseAndReturn } = useExpenses();
  const selectedGroupName =
    groupsData?.find((g) => g.id === selectedGroupId)?.name || "";

  const handleSelectGroup = async (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  const handleAddGroupExpense = async (expense: TablesInsert<"Expenses">) => {
    const { id } = (await insertNewExpenseAndReturn(expense))[0];
    setModalPage(0);
    return id;
  };

  const handleEditGroup = () => {
    setIsEditModalOpen(true);
  };

  return (
    <Template>
      <Content>
        <div className="flex min-h-screen p-6 bg-content-background">
          {/* Single Large Panel */}
          <div className="flex-1">
            <div className="bg-white rounded-xl p-5 flex gap-6">
              {/* Left Section */}
              <div className="flex-2">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold m-0 text-sidebar-title">
                    {selectedGroupName || "Select a Group"}
                  </h2>
                  {
                    selectedGroupId &&
                    <div className="flex gap-3">
                      <button
                        onClick={() => setModalPage(1)}
                        className="flex items-center gap-1.5 py-2 px-4 text-white text-sm cursor-pointer rounded-md border-none bg-expense-add-btn"
                      >
                        <span className="text-base">+</span>
                        Add Expense
                      </button>
                    </div>
                  }
                </div>
                <ActivityList
                  activityData={activityData}
                  activityLoading={activityLoading}
                  settleSplit={settleSplit}
                />
              </div>

              {/* Vertical Divider Line */}
              <div className="w-[1px] self-stretch bg-divider" />

              <div className="flex-1">
                <MembersList
                  members={groupMembersData ?? []}
                  groupId={selectedGroupId}
                />
              </div>

              {/* Modal */}
              <AddGroupExpenseModal
                isOpen={modalPage == 1}
                onClose={() => {
                  setModalPage(0);
                  setPage1Reset((k) => k + 1);
                }}
                onNext={setModalPage}
                setExpense={setExpense}
                selectedGroup={selectedGroupId || ""}
                key={page1Reset}
              />
              <SplitEvenlyModal
                isOpen={modalPage == 2}
                onClose={() => {
                  setModalPage(0);
                  setPage1Reset((k) => k + 1);
                }}
                onSave={handleAddGroupExpense}
                setPage={setModalPage}
                expense={expense}
                selectedGroup={selectedGroupId || ""}
                members={groupMembersData}
                refetch={refetch}
              />
              <SplitCustomModal
                isOpen={modalPage == 3}
                onClose={() => {
                  setModalPage(0);
                  setPage1Reset((k) => k + 1);
                }}
                onSave={handleAddGroupExpense}
                setPage={setModalPage}
                expense={expense}
                selectedGroup={selectedGroupId || ""}
                members={groupMembersData}
                refetch={refetch}
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
    </Template>
  );
};

export default Groups;
