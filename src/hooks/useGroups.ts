import { useMutation, useQuery } from "@tanstack/react-query";
import {
  insertGroup as insertGroupApi,
  insertGroupMembership as insertGroupMembershipApi,
  getUserGroups,
  getGroup,
} from "@/api/groups";
import { useGroupStore } from "@/stores/useGroupStore";

const useGroups = () => {
  const mutation = useMutation({
    mutationFn: async (groupName: string) => {
      const group = await insertGroupApi(groupName);
      await insertGroupMembershipApi(group.id);
      return group;
    },
    onError: (err) => {
      console.error("error inserting new group:", err);
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
    mutation.mutate(groupName);
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

  return { groupsData, getGroupsError, refetchGroups, insertNewGroup, currentGroupData, isLoading, error };
};

export default useGroups;