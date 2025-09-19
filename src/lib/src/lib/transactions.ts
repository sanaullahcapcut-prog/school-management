import { supabase } from "./supabase";

export type TxType = "credit" | "debit";
export type Tx = {
  id: string;
  type: TxType;
  amount: number;
  note?: string | null;
  created_at: string;
};

export async function fetchTransactions(): Promise<Tx[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((t: any) => ({ ...t, amount: Number(t.amount) }));
}

export async function addTransaction(type: TxType, amount: number, note?: string) {
  const { error } = await supabase
    .from("transactions")
    .insert({ type, amount, note: note ?? null });
  if (error) throw error;
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
}
