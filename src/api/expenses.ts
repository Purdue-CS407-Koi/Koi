import supabase from "@/helpers/supabase";
import type {
  UpdateExpenseProps,
  UpdateRecurringExpenseProps,
} from "@/interfaces/Expense";
import type { TablesInsert } from "@/helpers/supabase.types";

export async function getExpenses() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("user is undefined");
  }

  const { data, error } = await supabase
    .from("Expenses")
    .select("*")
    .eq("user_id", user.id);

  if (error) throw error;
  return data;
}

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

export async function getRecurringExpenses(bucket_metadata_id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("user is undefined");
  }

  const { data, error } = await supabase
    .from("RecurringExpenses")
    .select("*")
    .eq("bucket_metadata_id", bucket_metadata_id)
    .order("amount", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAllRecurringExpenses() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("user is undefined");
  }

  const { data, error } = await supabase.from("RecurringExpenses").select("*");

  if (error) throw error;
  return data;
}

export async function getExpenseComments(expense_id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("user is undefined");
  }

  const { data, error } = await supabase
    .from("ExpenseComments")
    .select("*")
    .eq("user_id", user!.id)
    .eq("expense_id", expense_id)
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

export async function insertNewRecurringExpense({
  amount,
  description,
  name,
  bucket_metadata_id,
}: TablesInsert<"RecurringExpenses">) {
  const { data, error } = await supabase
    .from("RecurringExpenses")
    .insert([
      {
        amount,
        description,
        name,
        bucket_metadata_id,
      },
    ])
    .select();
  if (error) throw error;
  return data;
}

export async function insertNewExpenseComment({
  content,
  expense_id,
}: TablesInsert<"ExpenseComments">) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("user is undefined");
  }
  const { data, error } = await supabase
    .from("ExpenseComments")
    .insert([
      {
        user_id: user!.id,
        content,
        expense_id,
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
  challenge_id,
  created_at,
}: UpdateExpenseProps) {
  const { data, error } = await supabase
    .from("Expenses")
    .update({ amount, description, name, challenge_id, created_at })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}

export async function updateRecurringExpense({
  amount,
  description,
  name,
  id,
}: UpdateRecurringExpenseProps) {
  const { data, error } = await supabase
    .from("RecurringExpenses")
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

export async function deleteRecurringExpense(id: string) {
  const { error } = await supabase
    .from("RecurringExpenses")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function deleteExpenseComment(id: string) {
  const { error } = await supabase
    .from("ExpenseComments")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
