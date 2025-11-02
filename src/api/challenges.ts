import supabase from "@/helpers/supabase";

import type {
  Tables,
  TablesInsert,
  TablesUpdate,
// TablesInsert,
//   TablesUpdate,
} from "@/helpers/supabase.types";

// Fetches all the app-wide challenges
export const getAppChallenges = async (): Promise<{
  accepted: Tables<"Challenges">[],
  notAccepted: Tables<"Challenges">[],
}> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Failed to fetch current user!");

  const { data, error } = await supabase
    .from("Challenges")
    .select(`
      *,
      ChallengeMemberships!left (
        user_id,
        challenge_id
      )
    `)
    .is("owner", null)
    .eq("ChallengeMemberships.user_id", user.id);

  if (error) throw error;

  const rows = (data ?? []);

  const accepted = rows.filter(r => r.ChallengeMemberships?.length > 0);
  const notAccepted = rows.filter(r => !r.ChallengeMemberships || r.ChallengeMemberships.length === 0);

  return { accepted, notAccepted };
};

// gets all group challenges created by the current user
export const getGroupChallenges = async (): Promise<
  Tables<"Challenges">[]
> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Failed to fetch current user!");

  const { data, error } = await supabase
    .from("Challenges")
    .select("*")
    .eq("owner", user.id);

  if (error) throw error;

  return data ?? [];
};

// gets all group challenges created by the current user
export const getActiveChallenges = async (): Promise<
  (Tables<"Challenges"> & { amount_used: number, joined: string, owner_name?: string | null, is_owner: boolean })[]
> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Failed to fetch current user!");

  const { data, error } = await supabase
  .from('Challenges')
  .select(`
    *,
    ChallengeMemberships!inner(user_id, created_at),
    Users!left(name),
    Expenses!left(amount, user_id)
  `)
  .eq('ChallengeMemberships.user_id', user.id);

  if (error) throw error;

  const challengesWithSums = (data ?? []).map((ch) => {
    const isOwner = ch.owner === user.id; 
    const ownerIsNull = ch.owner == null;

    const amount_used = (ch.Expenses ?? [])
      .filter((e: any) => (ownerIsNull ? e?.user_id === user.id : true))
      .reduce((s: number, e: any) => s + Number(e?.amount ?? 0), 0);

    return {
      ...ch,
      amount_used,
      joined: ch.ChallengeMemberships?.[0]?.created_at ?? "",
      owner_name: ch.Users?.name ?? null,
      is_owner: isOwner,
    };
  });

  if (error) throw error;

  return challengesWithSums;
};

// Creates a new ChallengeMemberships entry for the current user and supplied challenge ID
export const insertChallengeMembership = async (
  challenge_id: string
): Promise<Tables<"ChallengeMemberships">> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Failed to fetch current user!");
  }

  const { data, error } = await supabase
    .from("ChallengeMemberships")
    .insert([
      {
        challenge_id: challenge_id,
        user_id: user?.id,
      },
    ])
    .select();
    
  if (error) throw error;
  if (data.length !== 1)
    throw new Error("Failed to create new bucket metadata entry!");

  return data[0];
};

export const insertChallenge = async (
  challenge: TablesInsert<"Challenges">
): Promise<Tables<"Challenges">> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Failed to fetch current user!");
  }

  const { data, error } = await supabase
    .from("Challenges")
    .insert([
      {
        ...challenge,
        owner: user?.id,
      },
    ])
    .select();
  
  if (error) throw error;
  if (data.length !== 1)
    throw new Error("Failed to create new bucket metadata entry!");

  await supabase
    .from("ChallengeMemberships")
    .insert([
      {
        challenge_id: data[0].id,
        user_id: user?.id,
      },
    ])
    .select();

  return data[0];
};

export const editChallenge = async (
  challenge: TablesUpdate<"Challenges">
): Promise<Tables<"Challenges">> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Failed to fetch current user!");
  }

  if (challenge.id === undefined) {
    throw new Error("Challenge not found!");
  }

  const { data, error } = await supabase
    .from("Challenges")
    .update(challenge)
    .eq("id", challenge.id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const deleteChallengeMembership = async (
  challenge_id: string
): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Failed to fetch current user!");
  }
  const { error } = await supabase
    .from("ChallengeMemberships")
    .delete()
    .eq("challenge_id", challenge_id)
    .eq("user_id", user.id);

  if (error) throw error;
  return;
};