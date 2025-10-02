export interface NewExpense {
  amount: number;
  description: string;
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
}
