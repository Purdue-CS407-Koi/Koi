import supabase from "@/helpers/supabase";

export interface Group {
  id: string;
  name: string;
  created_at?: string;
}

export async function insertGroup(name: string) {
  const { data, error } = await supabase
    .from("Groups")
    .insert([
      { name: name },
    ])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function insertGroupMembership(groupId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("user is undefined");
  }

  const { data, error } = await supabase
    .from("GroupMemberships")
    .insert([{ user_id: user?.id, group_id: groupId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserGroups() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("user is undefined");
  }
  
  const { data, error } = await supabase
    .from("GroupMemberships")
    .select(`
      group_id,
      Groups ( id, name, created_at )
    `)
    .eq("user_id", user?.id);

  if (error) throw error;
  return data.map((gm) => gm.Groups);
}

export async function getGroup(groupId: string) {
  const { data, error } = await supabase
    .from("Groups")
    .select()
    .eq("id", groupId);

  if (error) {
    throw error;
  }

  if (data.length <= 0 || data.length > 1) {
    throw Error("ID does not exist or is not unique");
  }

  return data[0];
}

export const fetchGroupMembers = async (group_id: string) => {
  const { data: users, error } = await supabase
    .from("GroupMemberships")
    .select("id, created_at, Users!inner(id, name)")
    .eq("group_id", group_id);

  if (error) throw error;
  const data = (users ?? []).map((row: any) => row.Users);

  return data;
};

export const updateGroupName = async (groupId: string, newName: string) => {
  const { error } = await supabase
    .from("Groups")
    .update({ name: newName })
    .eq("id", groupId);

  if (error) throw error;
};

export const getGroupMembers = async (groupId: string) => {
  const { data, error } = await supabase
    .from("GroupMemberships")
    .select("user_id, Users(id, name)")
    .eq("group_id", groupId);

  if (error) throw error;

  return (data ?? []).map((item) => ({
    id: item.user_id,
    name: item.Users.name ?? "Unknown Member",
  }));
};

export const leaveGroup = async (groupId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is undefined");
  }

  const { error } = await supabase
    .from("GroupMemberships")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", user.id);

  if (error) throw error;

  return true;
};

export const removeGroupMember = async (group_id: string, user_id: string) => {
  const { error } = await supabase
    .from("GroupMemberships")
    .delete()
    .eq("group_id", group_id)
    .eq("user_id", user_id);

  if (error) throw error;
  return true;
};

export const fetchActivity = async (groupId?: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("user is undefined");
  }

  // figure out which group_ids we care about
  let groupIds: string[] = [];
  if (groupId) {
    groupIds = [groupId];
  } else {
    const { data: memberships, error: membershipError } = await supabase
      .from("GroupMemberships")
      .select("group_id")
      .eq("user_id", user.id);

    if (membershipError) throw membershipError;
    groupIds = memberships?.map((m) => m.group_id) ?? [];
  }

  // fetch splits across those groupIds
  const { data: splits, error } = await supabase
    .from("Splits")
    .select()
    .in("group_id", groupIds)
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!splits) return [];

  // run the same enrichment logic for each split
  const mapping = await Promise.all(
    splits.map(async (split) => {
      // if fully settled, recompute total from all splits
      if (((split.amount_owed ?? 0) + (split.amount_remaining ?? 0) === 0)) {
        const { data: allSplits, error: allSplitsError } = await supabase
          .from("Splits")
          .select()
          .eq("original_expense_id", split.original_expense_id ?? "");
        if (allSplitsError) throw allSplitsError;

        let amount_owed = 0;
        let amount_remaining = 0;
        allSplits.forEach((s) => {
          amount_owed -= s.amount_owed ?? 0;
          amount_remaining -= s.amount_remaining ?? 0;
        });

        const { data: expenseData, error: expenseError } = await supabase
          .from("Expenses")
          .select()
          .eq("id", split.original_expense_id ?? "")
          .single();
        if (expenseError) throw expenseError;

        const { data: userData, error: userError } = await supabase
          .from("Users")
          .select()
          .eq("id", expenseData.user_id ?? "")
          .single();
        if (userError) throw expenseError;

        return {
          ...split,
          amount_owed,
          amount_remaining,
          original_payment: expenseData.amount,
          original_payer: expenseData.user_id,
          original_payer_name: userData.name,
          name: expenseData.name,
        };
      } else {
        // normal case: just attach expense info
        const { data: expenseData, error: expenseError } = await supabase
          .from("Expenses")
          .select()
          .eq("id", split.original_expense_id ?? "")
          .single();
        if (expenseError) throw expenseError;

        const { data: userData, error: userError } = await supabase
          .from("Users")
          .select()
          .eq("id", expenseData.user_id ?? "")
          .single();
        if (userError) throw expenseError;

        return {
          ...split,
          original_payment: expenseData.amount,
          original_payer: expenseData.user_id,
          original_payer_name: userData.name,
          name: expenseData.name,
        };
      }
    })
  );

  return mapping;
};

export const settleSplit = async (settle_split_id: string, bucket_instance_id: string) => {
  const { data: split, error: splitError } = await supabase
    .from("Splits")
    .select()
    .eq("id", settle_split_id)
    .single();
  if (splitError) throw splitError;

  const { data: expense, error: expenseError } = await supabase    
    .from("Expenses")
    .select()
    .eq("id", split.original_expense_id ?? "")
    .single();
  if (expenseError) throw expenseError;

  const { error: payExpenseError } = await supabase
    .from("Expenses")
    .insert([
      { 
        amount: split.amount_remaining ?? 0, 
        name: expense?.name ?? "", 
        description: expense.description,
        settle_split_id: settle_split_id,
        user_id: split.user_id,
        bucket_instance_id: bucket_instance_id,
      },
    ]);
  if (payExpenseError) throw payExpenseError;

  const { error: paidExpenseError } = await supabase
    .from("Expenses")
    .insert([
      { 
        amount: (split.amount_remaining ?? 0) * -1, 
        name: expense?.name ?? "",
        description: expense.description,
        settle_split_id: settle_split_id,
        user_id: expense.user_id,
        bucket_instance_id: expense.bucket_instance_id,
      },
    ]);
  if (paidExpenseError) throw paidExpenseError;
  
  const { data, error } = await supabase
    .from("Splits")
    .update({ amount_remaining: 0 })
    .eq("id", settle_split_id)
    .select()
    .single();
  if (error) throw error;

  return data;
}