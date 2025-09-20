import { supabase } from "./supabase";

export type TxType = "credit" | "debit";

export type Tx = {
  id: string;
  type: TxType;
  amount: number;
  note?: string | null;
  category: string;
  tx_date: string;      // YYYY-MM-DD
  created_at: string;
};

function mapRow(t: any): Tx {
  return {
    id: t.id,
    type: t.type,
    amount: Number(t.amount),
    note: t.note ?? null,
    category: t.category ?? "General",
    tx_date: (t.tx_date ?? t.created_at?.slice(0,10)),
    created_at: t.created_at,
  };
}

export async function fetchTransactions(): Promise<Tx[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("id,type,amount,note,category,tx_date,created_at")
    .order("tx_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function fetchTransactionsInRange(start: string, end: string): Promise<Tx[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("id,type,amount,note,category,tx_date,created_at")
    .gte("tx_date", start)
    .lte("tx_date", end)
    .order("tx_date", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function insertTransaction(
  type: TxType,
  amount: number,
  note?: string,
  category: string = "General",
  txDate?: string  // YYYY-MM-DD
) {
  const payload: Partial<Tx> = {
    type,
    amount,
    note: note ?? null,
    category,
  };
  if (txDate) payload.tx_date = txDate;

  const { error } = await supabase.from("transactions").insert(payload);
  if (error) throw error;
}

export async function updateTransaction(
  id: string,
  patch: Partial<Pick<Tx, "type" | "amount" | "note" | "category" | "tx_date">>
) {
  const { error } = await supabase.from("transactions").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
}

export function summarize(rows: Tx[]) {
  const totalCredit = rows.filter(r => r.type === "credit").reduce((s,r)=>s+r.amount,0);
  const totalDebit  = rows.filter(r => r.type === "debit").reduce((s,r)=>s+r.amount,0);
  const byCategory: Record<string, number> = {};
  for (const r of rows) {
    const key = r.category ?? "General";
    const delta = r.type === "credit" ? r.amount : -r.amount;
    byCategory[key] = (byCategory[key] ?? 0) + delta;
  }
  return { totalCredit, totalDebit, net: totalCredit - totalDebit, byCategory };
}
