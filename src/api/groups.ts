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

// export const fetchActivity = async (groupId?: string) => {
//    const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) {
//     throw new Error("user is undefined");
//   }
//     let query = supabase
//     .from("Expenses")
//     .select("*, Splits!inner(group_id)")
//     .order("created_at", { ascending: false });

//   if (groupId) {
//     // Specific group
//     query = query.eq("Splits.group_id", groupId);
//   } else {
//     // All groups for user
//     query = query.in(
//       "Splits.group_id",
//       (
//         await supabase
//           .from("GroupMemberships")
//           .select("group_id")
//           .eq("user_id", user?.id)
//       ).data?.map((row) => row.group_id) ?? []
//     );
//   }

//   const { data, error } = await query;
//   if (error) throw error;
//   return data;
// };
export const fetchActivity = async (groupId?: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("user is undefined");
  }

  let query = supabase
    .from("Splits")
    .select()
    .order("created_at", { ascending: false });

  if (groupId) {
    // Specific group
    query = query.eq("group_id", groupId);
    query = query.eq("user_id", user?.id);

    const { data, error } = await query;
    if (error) throw error;
    
    const mapping = await Promise.all (
      data.map(async (split) => {
        if ((split.amount_owed ?? 0) + (split.amount_remaining ?? 0) == 0) {
          const { data, error } = await supabase
            .from("Splits")
            .select()
            .eq("original_expense_id", split.original_expense_id ?? "");
          if (error) throw error;

          let amount_owed = 0;
          let amount_remaining = 0;
          data.forEach((split_owe) => {
            amount_owed -= split_owe.amount_owed ?? 0;
            amount_remaining -= split_owe.amount_remaining ?? 0;
          });
          
          const { data: expenseData, error: expenseError } = await supabase
            .from("Expenses")
            .select()
            .eq("id", split.original_expense_id ?? "")
            .single(); 
          if (expenseError) throw expenseError;

          return {
            ...split,
            amount_owed: amount_owed,
            amount_remaining: amount_remaining,
            original_payment: expenseData.amount,
            original_payer: expenseData.user_id,
            name: expenseData.name,
          }
        } else {
          const { data: expenseData, error: expenseError } = await supabase
            .from("Expenses")
            .select()
            .eq("id", split.original_expense_id ?? "")
            .single(); 
          if (expenseError) throw expenseError;

          return {
            ...split,
            original_payment: expenseData.amount,
            original_payer: expenseData.user_id,
            name: expenseData.name,
          };
        }
      })
    );

    return mapping;

  } else {
    // All groups for the user (via memberships)
    query = query.in(
      "group_id",
      (
        await supabase
          .from("GroupMemberships")
          .select("group_id")
          .eq("user_id", user.id)
      ).data?.map((row) => row.group_id) ?? []
    );
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
};
