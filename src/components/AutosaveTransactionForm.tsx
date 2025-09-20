import { useEffect, useMemo, useRef, useState } from "react";
import { insertTransaction, updateTransaction, TxType } from "@/lib/transactions";

// simple debounce hook
function useDebouncedCallback<T extends (...args: any[]) => void>(fn: T, delay = 800) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  return (...args: Parameters<T>) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  };
}

export default function AutosaveTransactionForm({ initialType = "credit" as TxType }) {
  const [type, setType] = useState<TxType>(initialType);
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [rowId, setRowId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const isValid = useMemo(() => Number.isFinite(amount) && amount > 0, [amount]);

  const doSave = useDebouncedCallback(async (payload: { type: TxType; amount: number; note: string }) => {
    try {
      setStatus("saving");
      if (!rowId) {
        // first valid save: create
        const id = await insertTransaction(payload.type, payload.amount, payload.note);
        setRowId(id);
      } else {
        // subsequent edits: update
        await updateTransaction(rowId, payload);
      }
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1000);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }, 800);

  useEffect(() => {
    if (isValid) doSave({ type, amount, note });
  }, [type, amount, note, isValid, doSave]);

  return (
    <div className="p-4 border rounded-xl max-w-xl">
      <div className="mb-2 font-medium">Auto-saved Transaction</div>

      <div className="flex gap-2 mb-3">
        <select
          className="border rounded px-2 py-1"
          value={type}
          onChange={(e) => setType(e.target.value as TxType)}
        >
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>

        <input
          className="border rounded px-2 py-1 w-36"
          type="number"
          placeholder="Amount"
          value={amount || ""}
          onChange={(e) => setAmount(Number(e.target.value))}
          min={0}
        />

        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="Note (auto-saves)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="text-sm opacity-75">
        {status === "saving" && "Saving…"}
        {status === "saved" && "Saved ✓"}
        {status === "error" && "Error saving (open console)"}
        {status === "idle" && (!isValid ? "Enter an amount > 0 to start auto-saving." : rowId ? `Editing #${rowId}` : "Ready")}
      </div>
    </div>
  );
}
