import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  insertGroup as insertGroupApi,
  insertGroupMembership as insertGroupMembershipApi,
  getUserGroups,
  fetchActivity,
  updateGroupName as editGroupApi,
  getGroup,
  getGroupMembers,
  settleSplit as settleSplitApi,
  leaveGroup as leaveGroupApi,
  removeGroupMember as removeGroupMemberApi,
inviteFriendToGroup,
  getPendingInvites,
  acceptInvite,
  declineInvite,
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

  const leaveGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      return await leaveGroupApi(groupId);
    },
    onError: (err) => {
      console.error("Error leaving group:", err);
    },
    onSuccess: async () => {
      refetchGroups();
    },
  });
  
  const removeMemberMutation = useMutation({
    mutationFn: async ({ group_id, user_id }: { group_id: string; user_id: string }) =>
      removeGroupMemberApi(group_id, user_id),
    onSuccess: (_, { group_id }) => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", group_id] });
    },
    onError: (err) => {
      console.error("Error removing member:", err);
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

const leaveGroup = (groupId: string) => {
    leaveGroupMutation.mutate(groupId);
  };
const removeMember = (group_id: string, user_id: string) => {
  removeMemberMutation.mutate({ group_id, user_id });
};


const inviteFriendMutation = useMutation({
    mutationFn: async ({ groupId, friendEmail }: { groupId: string; friendEmail: string }) =>
      inviteFriendToGroup(groupId, friendEmail),
    onError: (err) => console.error("Error inviting friend:", err),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingInvites"] });
    },
  });

  const { data: pendingInvites, refetch: refetchPendingInvites } = useQuery({
    queryKey: ["pendingInvites"],
    queryFn: getPendingInvites,
  });

  const acceptInviteMutation = useMutation({
    mutationFn: async (inviteId: string) => acceptInvite(inviteId),
    onError: (err) => console.error("Error accepting invite:", err),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pendingInvites"] });
      await refetchGroups();
    },
  });

  const declineInviteMutation = useMutation({
    mutationFn: async (inviteId: string) => declineInvite(inviteId),
    onError: (err) => console.error("Error declining invite:", err),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingInvites"] });
    },
  });

  const inviteFriend = (groupId: string, friendEmail: string) =>
    inviteFriendMutation.mutate({ groupId, friendEmail });
  const acceptGroupInvite = (inviteId: string) => acceptInviteMutation.mutate(inviteId);
  const declineGroupInvite = (inviteId: string) => declineInviteMutation.mutate(inviteId);


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
      queryFn: () => getGroupMembers(group_id),
    });
  
    return { groupMembersData, isLoading, error };
  };

return {
    groupsData,
    getGroupsError,
    refetchGroups,
    currentGroupData,
    isLoading,
    error,
    useGroupMembers,
    useActivity,

    insertNewGroup,
    editGroup,
    leaveGroup,
    removeMember,
    settleSplit,

    // Invites
    inviteFriend,
    pendingInvites,
    refetchPendingInvites,
    acceptGroupInvite,
    declineGroupInvite,
  };};

export default useGroups;