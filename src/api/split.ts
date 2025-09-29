import supabase from "../helpers/supabase";
import type { NewSplit } from "../interfaces/Split";

export async function insertNewSplit({
  expense_id,
  amount_owed,
  amount_remaining,
  group_id,
}: NewSplit) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("Splits")
    .insert([
      {
        amount_owed,
        amount_remaining,
        expense_id,
        group_id,
        user_id: user?.id,
      },
    ])
    .select();
  if (error) throw error;
  return data;
}
