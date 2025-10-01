import { useMutation, useQuery } from "@tanstack/react-query";
import {
  insertGroup as insertGroupApi,
  insertGroupMembership as insertGroupMembershipApi,
  getUserGroups,
  fetchActivity,
  updateGroupName as editGroupApi,
  getGroup,
} from "@/api/groups";
import { useGroupStore } from "@/stores/useGroupStore";

const useGroups = () => {
  const insertMutation = useMutation({
    mutationFn: async (groupName: string) => {
      const group = await insertGroupApi(groupName);
      await insertGroupMembershipApi(group.id);
      return group;
    },
    onError: (err) => {
      console.error("Error inserting new group:", err);
    },
    onSuccess: () => {
      refetchGroups();
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ groupId, groupName }: { groupId: string; groupName: string }) => {
      return await editGroupApi(groupId, groupName);
    },
    onError: (err) => {
      console.error("Error editing group:", err);
    },
    onSuccess: () => {
      refetchGroups();
    },
  });

  const {
    data: groupsData,
    error: getGroupsError,
    refetch: refetchGroups,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const rawData = await getUserGroups();
      return rawData?.map((item) => ({
        ...item,
        created_at: item.created_at.split("T")[0],
      }));
    },
  });

  const insertNewGroup = (groupName: string) => {
    insertMutation.mutate(groupName);
  };

  const editGroup = (groupId: string, groupName: string) => {
    editMutation.mutate({ groupId, groupName });
  };

  const useActivity = (userId: string, groupId?: string) => {
  return useQuery({
    queryKey: ["activity", userId, groupId],
    queryFn: () => fetchActivity(userId, groupId),
    enabled: !!userId, // only run when userId exists
  });
};

  const currentGroupId = useGroupStore((state) => state.currentGroupId);
  const {
    data: currentGroupData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["group", currentGroupId], // Zustand state as part of key
    queryFn: () => getGroup(currentGroupId),
  });

  return { groupsData, getGroupsError, useActivity, refetchGroups, insertNewGroup, currentGroupData, isLoading, error, editGroup };
};

export default useGroups;