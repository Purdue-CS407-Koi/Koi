import supabase from "@/helpers/supabase";

import type {
  Tables,
//   TablesInsert,
//   TablesUpdate,
} from "@/helpers/supabase.types";

// Fetches all the app-wide challenges
export const getAppChallenges = async (): Promise<
  Tables<"Challenges">[]
> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Failed to fetch current user!");
  }

  const { data, error } = await supabase
    .from("Challenges")
    .select("*")
    .is("owner", null);

  if (error) throw error;
  return data;
};