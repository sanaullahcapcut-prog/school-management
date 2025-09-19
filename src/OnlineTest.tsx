import { useEffect, useState } from "react";
import { fetchTransactions, addTransaction, deleteTransaction, Tx } from "./lib/transactions";

export default function OnlineTest() {
  const [items, setItems] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState("");

  async function reload() {
    setLoading(true);
    try {
      const rows = await fetchTransactions();
      setItems(rows);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { reload(); }, []);

  async function onAdd(type: "credit" | "debit") {
    if (!amount) return;
    await addTransaction(type, amount, note);
    setAmount(0); setNote("");
    await reload();
  }

  return (
    <div style={{ maxWidth: 640, margin: "24px auto", padding: 16 }}>
      <h1>Finance (Online test)</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input type="number" placeholder="Amount" value={amount || ""} onChange={e=>setAmount(Number(e.target.value))} />
        <input placeholder="Note (optional)" value={note} onChange={e=>setNote(e.target.value)} />
        <button onClick={()=>onAdd("credit")}>Add Credit</button>
        <button onClick={()=>onAdd("debit")}>Add Debit</button>
      </div>
      {loading ? <div>Loading…</div> : (
        <ul>
          {items.map(t=>(
            <li key={t.id} style={{ display:"flex", justifyContent:"space-between", border:"1px solid #ddd", padding:8, marginBottom:6 }}>
              <span>{t.type.toUpperCase()} — {t.amount} {t.note ? `— ${t.note}` : ""}</span>
              <button onClick={()=>deleteTransaction(t.id).then(reload)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
