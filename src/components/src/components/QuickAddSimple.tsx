import { useState } from "react";
import { insertTransaction } from "../lib/transactions";

const CATEGORIES = [
  "General",
  "Fees",
  "Salary",
  "Bills",
  "Stationery",
  "Maintenance",
];

export default function QuickAddSimple() {
  const [type, setType] = useState<"credit" | "debit">("credit");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("General");
  const [txDate, setTxDate] = useState<string>(() => new Date().toISOString().slice(0,10));
  const [msg, setMsg] = useState<string>("");

  async function onSave() {
    const n = parseFloat(amount);
    if (!Number.isFinite(n) || n <= 0) {
      setMsg("Enter a valid amount (> 0)");
      return;
    }
    setMsg("Saving…");
    try {
      await insertTransaction(type, n, note, category, txDate);
      setAmount(""); setNote("");
      setMsg("Saved ✓");
      setTimeout(() => setMsg(""), 1000);
    } catch (e: any) {
      setMsg("Error: " + (e?.message || "Failed to save"));
    }
  }

  return (
    <div className="p-4 border rounded-xl">
      <div className="mb-2 font-medium">Quick Add (with Save)</div>

      <div className="flex flex-col md:flex-row gap-2">
        <select
          className="border rounded px-2 py-1"
          value={type}
          onChange={(e) => setType(e.target.value as "credit" | "debit")}
        >
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>

        <input
          className="border rounded px-2 py-1 w-36"
          type="text"
          inputMode="decimal"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          className="border rounded px-2 py-1 w-44"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          className="border rounded px-2 py-1 w-40"
          type="date"
          value={txDate}
          onChange={(e) => setTxDate(e.target.value)}
        />

        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="Note / Description"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button className="border rounded px-3 py-1" onClick={onSave}>
          Save
        </button>
      </div>

      <div className="text-sm opacity-75 mt-1">{msg}</div>
    </div>
  );
}
