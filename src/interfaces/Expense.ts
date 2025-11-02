export interface NewExpense {
  amount: number;
  description?: string;
  name: string;
  bucket_instance_id?: string;
  settle_split_id?: string;
  challenge_id?: string;
  user_id?: string;
}

export interface UpdateExpenseProps {
  amount: number;
  description: string;
  name: string;
  id: string;
  challenge_id: string | null;
}

export interface RecurringExpense {
  created_at: string;
  amount: number | null;
  bucket_metadata_id: string | null;
  description: string | null;
  id: string;
  name: string | null;
}

export interface UpdateRecurringExpenseProps {
  amount: number;
  description: string;
  name: string;
  id: string;
}
