import { supabase } from "./supabase";

export type TxType = "credit" | "debit";
export type Tx = {
  id: string;
  type: TxType;
  amount: number;
  note?: string | null;
  created_at: string;
};

// Load latest transactions
export async function fetchTransactions(): Promise<Tx[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((t: any) => ({ ...t, amount: Number(t.amount) }));
}

// Insert and return new row id (for autosave first create)
export async function insertTransaction(type: TxType, amount: number, note?: string) {
  const { data, error } = await supabase
    .from("transactions")
    .insert({ type, amount, note: note ?? null })
    .select("id")
    .single();
  if (error) throw error;
  return data!.id as string;
}

// Update partial fields on existing row (for autosave updates)
export async function updateTransaction(
  id: string,
  patch: Partial<Pick<Tx, "type" | "amount" | "note">>
) {
  const { error } = await supabase.from("transactions").update(patch).eq("id", id);
  if (error) throw error;
}

// Optional delete helper
export async function deleteTransaction(id: string) {
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
}
