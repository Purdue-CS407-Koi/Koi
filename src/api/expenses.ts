import supabase from "@/helpers/supabase";
import type { NewExpense } from "@/interfaces/Expense";

export async function insertNewExpense({
  amount,
  description,
  name,
  bucket_instance_id,
  settle_split_id,
  challenge_id,
}: NewExpense) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("Expenses")
    .insert([
      {
        amount,
        description,
        name,
        user_id: user?.id,
        bucket_instance_id,
        settle_split_id,
        challenge_id,
      },
    ])
    .select();
  if (error) throw error;
  return data;
}
