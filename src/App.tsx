import { useEffect, useMemo, useState } from "react";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { LoginScreen } from "./components/LoginScreen";
import { FinanceDashboard } from "./components/FinanceDashboard";
import { CreditManagement } from "./components/CreditManagement";
import { DebitManagement } from "./components/DebitManagement";
import { ExpensesModule } from "./components/ExpensesModule";
import { ReportsModule } from "./components/ReportsModule";
import { Button } from "./components/ui/button";
import { Menu } from "lucide-react";

// ✅ ONLINE DB helpers (Supabase)
import {
  fetchTransactions as dbFetch,
  insertTransaction as dbInsert,
  updateTransaction as dbUpdate,
  deleteTransaction as dbDelete,
  Tx,
  TxType,
} from "./lib/transactions";

// (Optional) no-button autosave form to quickly add/edit one row
import AutosaveTransactionForm from "./components/AutosaveTransactionForm";

interface Transaction {
  id: string;
  date: string;            // mapped from DB created_at (YYYY-MM-DD)
  amount: number;
  category: string;        // we map "General" for now
  description: string;     // mapped from DB note
  type: "credit" | "debit";
}

type ActivePage = "dashboard" | "credit" | "debit" | "expenses" | "reports";

function toUI(t: Tx): Transaction {
  const iso = t.created_at ?? new Date().toISOString();
  const ymd = iso.slice(0, 10); // YYYY-MM-DD
  return {
    id: t.id,
    date: ymd,
    amount: Number(t.amount),
    category: "General", // adjust if you later add categories in DB
    description: t.note ?? "",
    type: t.type as "credit" | "debit",
  };
}

function toDBPatch(t: Omit<Transaction, "id" | "date"> & { type: TxType }) {
  return {
    type: t.type,
    amount: t.amount,
    note: t.description,
  };
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState<ActivePage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 🔗 This state mirrors the DB
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from Supabase on mount
  async function reload() {
    setLoading(true);
    try {
      const rows = await dbFetch();       // Tx[]
      setTransactions(rows.map(toUI));    // Transaction[]
    } catch (e) {
      console.error("Failed to load transactions:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  const handleLogin = () => setIsLoggedIn(true);

  // ➕ Add = INSERT into DB, then reload UI
  const handleAddTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      await dbInsert(
        transaction.type,
        transaction.amount,
        transaction.description
      );
      await reload();
    } catch (e) {
      console.error("Add failed:", e);
    }
  };

  // ✏️ Update = UPDATE in DB, then reload UI
  const handleUpdateTransaction = async (id: string, updated: Omit<Transaction, "id">) => {
    try {
      await dbUpdate(id, toDBPatch({ ...updated, type: updated.type as TxType }));
      await reload();
    } catch (e) {
      console.error("Update failed:", e);
    }
  };

  // 🗑️ Delete = DELETE in DB, then update UI
  const handleDeleteTransaction = async (id: string) => {
    try {
      await dbDelete(id);
      // Optimistic update
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderActivePage = () => {
    // While loading from DB, you can show skeletons/spinners if you like
    const commonProps = {
      transactions,
      onAddTransaction: handleAddTransaction,
      onUpdateTransaction: handleUpdateTransaction,
      onDeleteTransaction: handleDeleteTransaction,
    };

    switch (activePage) {
      case "dashboard":
        return <FinanceDashboard transactions={transactions} onAddTransaction={handleAddTransaction} />;
      case "credit":
        return <CreditManagement {...commonProps} />;
      case "debit":
        return <DebitManagement {...commonProps} />;
      case "expenses":
        return <ExpensesModule {...commonProps} />;
      case "reports":
        return <ReportsModule transactions={transactions} />;
      default:
        return <FinanceDashboard transactions={transactions} onAddTransaction={handleAddTransaction} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar
          activePage={activePage}
          setActivePage={setActivePage}
          isOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Mobile menu button */}
            <div className="flex items-center gap-4 md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>

            {/* (Optional) No-button autosave block — remove if you don't want it visible */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Quick Add (Auto-save)</h2>
              <AutosaveTransactionForm />
              <div className="text-sm opacity-70 mt-1">
                Type amount & note — it auto-saves to the online database.
              </div>
            </div>

            {/* Main page content */}
            {loading ? <div>Loading…</div> : renderActivePage()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
