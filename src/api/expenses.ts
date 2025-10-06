import supabase from "@/helpers/supabase";
import type { UpdateExpenseProps } from "@/interfaces/Expense";
import type { TablesInsert } from "@/helpers/supabase.types";

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
    .eq("bucket_instance_id", bucket_instance_id)
    .order("created_at", { ascending: false });

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
}: TablesInsert<"Expenses">) {
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
