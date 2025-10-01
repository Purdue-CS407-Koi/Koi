import supabase from "@/helpers/supabase";
import type { NewSplit } from "@/interfaces/Split";

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
export async function getSplit(split_id: string) {
  const { data, error } = await supabase
    .from("Splits")
    .select()
    .eq("id", split_id);

  if (error) {
    throw error;
  }

  if (data.length <= 0 || data.length > 1) {
    throw Error("ID does not exist or is not unique");
  }

  return data[0];
}
