import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  insertGroup as insertGroupApi,
  insertGroupMembership as insertGroupMembershipApi,
  getUserGroups,
  fetchActivity,
  updateGroupName as editGroupApi,
  getGroup,
  fetchGroupMembers,
  settleSplit as settleSplitApi,
} from "@/api/groups";
import { useGroupStore } from "@/stores/useGroupStore";

const useGroups = () => {
  const queryClient = useQueryClient();
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

  const useActivity = (groupId?: string) => {
    return useQuery({
      queryKey: ["activity", groupId],
      queryFn: () => fetchActivity(groupId),
    });
  };

  const settlingMutation = useMutation({
    mutationFn: ({ settle_split_id, bucket_instance_id }: {settle_split_id: string, bucket_instance_id: string}) =>
      settleSplitApi(settle_split_id, bucket_instance_id),

    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["activity", _data.group_id] });
      queryClient.invalidateQueries({ queryKey: ["activity", undefined] });
    },

    onError: (err) => {
      console.error("Error settling split:", err);
    },
  });

  const settleSplit = (settle_split_id: string, bucket_instance_id: string) => {
    settlingMutation.mutate({settle_split_id, bucket_instance_id});
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

  const useGroupMembers = (group_id: string) => {
    const {
      data: groupMembersData,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["groupMembers", group_id], // Zustand state as part of key
      queryFn: () => fetchGroupMembers(group_id),
    });
  
    return { groupMembersData, isLoading, error };
  };

  return { groupsData, getGroupsError, useGroupMembers, useActivity, refetchGroups, insertNewGroup, currentGroupData, isLoading, error, editGroup, settleSplit };
};

export default useGroups;