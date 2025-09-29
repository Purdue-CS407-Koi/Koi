import supabase from "../helpers/supabase";
import type { NewSplit } from "../interfaces/Split";

export async function insertNewSplit({
  original_expense_id,
  amount_owed,
  amount_remaining,
  group_id,
  user_id
}: NewSplit) {

  const { data, error } = await supabase
    .from("Splits")
    .insert([
      {
        amount_owed,
        amount_remaining,
        original_expense_id,
        group_id,
        user_id,
      },
    ])
    .select();
  if (error) throw error;
  return data;
}
