import supabase from "@/helpers/supabase";
import type { NewExpense, UpdateExpenseProps } from "@/interfaces/Expense";

export async function getExpensesFromBucket(bucket_instance_id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("user is undefined");
  }

  const { data, error } = await supabase
    .from("Expenses")
    .select("*")
    .eq("user_id", user!.id)
    .eq("bucket_instance_id", bucket_instance_id);

  if (error) throw error;
  return data;
}

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

export async function updateExpense({
  amount,
  description,
  name,
  id,
}: UpdateExpenseProps) {
  const { data, error } = await supabase
    .from("Expenses")
    .update({ amount, description, name })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}

export async function deleteExpense(id: string) {
  const { error } = await supabase.from("Expenses").delete().eq("id", id);
  if (error) throw error;
}
