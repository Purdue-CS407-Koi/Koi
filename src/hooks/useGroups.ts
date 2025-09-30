import { useMutation, useQuery } from "@tanstack/react-query";
import {
  insertGroup as insertGroupApi,
  insertGroupMembership as insertGroupMembershipApi,
  getUserGroups,
} from "@/api/groups";
import { useUserStore } from "@/stores/useUserStore";

const useGroups = () => {
  const currentUserId = useUserStore((state) => state.currentUserId);

  // refetch function will be defined later from useQuery
  let refetchGroups: () => void;

  const mutation = useMutation({
    mutationFn: async (groupName: string) => {
      if (!currentUserId) throw new Error("No user id available");
      const group = await insertGroupApi(groupName);
      await insertGroupMembershipApi(currentUserId, group.id);
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
    refetch,
  } = useQuery({
    queryKey: ["groups", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const rawData = await getUserGroups(currentUserId);
      return rawData?.map((item) => ({
        ...item,
        created_at: item.created_at.split("T")[0],
      }));
    },
    enabled: !!currentUserId,
  });

  // assign refetch so mutation can use it
  refetchGroups = refetch;

  const insertNewGroup = (groupName: string) => {
    mutation.mutate(groupName);
  };

  return { groupsData, getGroupsError, refetchGroups, insertNewGroup };
};

export default useGroups;
