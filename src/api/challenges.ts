import supabase from "@/helpers/supabase";

import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/helpers/supabase.types";

// Fetches all the app-wide challenges
export const getAppChallenges = async (): Promise<Tables<"Challenges">[]> => {
  const { data, error } = await supabase.from("Challenges").select("*");

  if (error) throw error;

  return data ?? [];
};

// Fetches all the app-wide challenges and sort into accepted/not accepted for the current user
export const getAppChallengesForUser = async (): Promise<{
  accepted: Tables<"Challenges">[];
  notAccepted: Tables<"Challenges">[];
}> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Failed to fetch current user!");

  const { data, error } = await supabase
    .from("Challenges")
    .select(
      `
      *,
      ChallengeMemberships!left (
        user_id,
        challenge_id
      )
    `,
    )
    .is("owner", null)
    .eq("ChallengeMemberships.user_id", user.id);

  if (error) throw error;

  const rows = data ?? [];

  const accepted = rows.filter((r) => r.ChallengeMemberships?.length > 0);
  const notAccepted = rows.filter(
    (r) => !r.ChallengeMemberships || r.ChallengeMemberships.length === 0,
  );

  return { accepted, notAccepted };
};

// gets all group challenges created by the current user
export const getGroupChallenges = async (): Promise<Tables<"Challenges">[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
  (Tables<"Challenges"> & {
    amount_used: number;
    joined: string;
    owner_name?: string | null;
    is_owner: boolean;
  })[]
> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Failed to fetch current user!");

  const { data, error } = await supabase
    .from("Challenges")
    .select(
      `
    *,
    ChallengeMemberships!inner(user_id, created_at),
    Users!left(name),
    Expenses!left(amount, user_id)
  `,
    )
    .eq("ChallengeMemberships.user_id", user.id);

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

// Get the number of users for the given challenge ID
export const getChallengeUserCount = async (
  challenge_id: string,
): Promise<number> => {
  const { data, error } = await supabase
    .from("ChallengeMemberships")
    .select("id")
    .eq("challenge_id", challenge_id);

  if (error) throw error;

  return data.length;
};

// Get the number of challenges the user with the given ID has
export const getUserChallengeCount = async (
  user_id: string,
): Promise<number> => {
  const { data, error } = await supabase
    .from("ChallengeMemberships")
    .select("id")
    .eq("user_id", user_id);

  if (error) throw error;

  return data.length;
};

// Creates a new ChallengeMemberships entry for the current user and supplied challenge ID
export const insertChallengeMembership = async (
  challenge_id: string,
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
  challenge: TablesInsert<"Challenges">,
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
  challenge: TablesUpdate<"Challenges">,
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
  challenge_id: string,
): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
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

export const inviteFriendToChallenge = async (
  challengeId: string,
  friendEmail: string,
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User is undefined");

  // Get friend's user ID
  const { data, error } = await supabase.rpc("get_user_id_by_email", {
    email_input: friendEmail,
  });
  if (error) throw error;
  if (!data || data.length === 0)
    throw new Error("No user found with that email");

  const friendId = data[0].user_id;

  // Prevent duplicate invites
  const { data: existingInvite, error: checkError } = await supabase
    .from("ChallengeInvites")
    .select("id, type")
    .eq("challenge_id", challengeId)
    .eq("invite_to", friendId)
    .maybeSingle();

  if (checkError) throw checkError;

  if (existingInvite) {
    if (existingInvite.type === 0)
      throw new Error("An invite is already pending for this user.");
    if (existingInvite.type === 1)
      throw new Error("This user has already joined this challenge.");
  }

  // Create invite
  const { data: invite, error: insertError } = await supabase
    .from("ChallengeInvites")
    .insert([
      {
        challenge_id: challengeId,
        invite_from: user.id,
        invite_to: friendId,
        type: 0,
      },
    ])
    .select()
    .single();

  if (insertError) throw insertError;
  return invite;
};

// Accept an invite → adds the user to the group and updates status
export const acceptChallengeInvite = async (inviteId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User is undefined");

  // Get invite info
  const { data: invite, error: inviteError } = await supabase
    .from("ChallengeInvites")
    .select("challenge_id, invite_to, type")
    .eq("id", inviteId)
    .single();
  if (inviteError) throw inviteError;

  if (invite.type !== 0) throw new Error("Invite already handled");

  // Add the user to the group
  if (!invite || !invite.challenge_id) {
    throw new Error("Invite is missing");
  }
  const { error: membershipError } = await supabase
    .from("ChallengeMemberships")
    .insert([{ challenge_id: invite.challenge_id, user_id: user.id }]);
  if (membershipError) throw membershipError;

  // Update invite status
  const { error: updateError } = await supabase
    .from("ChallengeInvites")
    .delete()
    .eq("id", inviteId);
  if (updateError) throw updateError;

  return true;
};

// Decline an invite
export const declineChallengeInvite = async (inviteId: string) => {
  const { error } = await supabase
    .from("ChallengeInvites")
    .delete()
    .eq("id", inviteId);

  if (error) throw error;
  return true;
};

export const getPendingChallengeInvites = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("ChallengeInvites")
    .select("*, Challenges(name)")
    .eq("invite_to", user.id);

  if (error) throw error;
  return data;
};
