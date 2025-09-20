import { useEffect, useState } from "react";
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

import { supabase } from "./lib/supabase";

import {
  fetchTransactions as dbFetch,
  insertTransaction as dbInsert,
  updateTransaction as dbUpdate,
  deleteTransaction as dbDelete,
  Tx,
  TxType,
} from "./lib/transactions";

import QuickAddSimple from "./components/QuickAddSimple";

interface Transaction {
  id: string;
  date: string;        // YYYY-MM-DD (tx_date)
  amount: number;
  category: string;
  description: string;
  type: "credit" | "debit";
}

type ActivePage = "dashboard" | "credit" | "debit" | "expenses" | "reports";

function toUI(t: Tx): Transaction {
  return {
    id: t.id,
    date: t.tx_date ?? t.created_at.slice(0, 10),
    amount: Number(t.amount),
    category: t.category ?? "General",
    description: t.note ?? "",
    type: t.type as "credit" | "debit",
  };
}

function toDBPatch(t: Omit<Transaction, "id"> & { type: TxType }) {
  return {
    type: t.type,
    amount: t.amount,
    note: t.description,
    category: t.category ?? "General",
    tx_date: t.date, // YYYY-MM-DD
  };
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState<ActivePage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Keep auth session in sync
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function reload() {
    setLoading(true);
    try {
      const rows = await dbFetch();
      setTransactions(rows.map(toUI));
    } catch (e) {
      console.error("Failed to load transactions:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoggedIn) reload();
  }, [isLoggedIn]);

  const handleLogin = () => setIsLoggedIn(true);

  const handleAddTransaction = async (t: Omit<Transaction, "id">) => {
    try {
      await dbInsert(t.type, t.amount, t.description, t.category, t.date);
      await reload();
    } catch (e) {
      console.error("Add failed:", e);
    }
  };

  const handleUpdateTransaction = async (id: string, updated: Omit<Transaction, "id">) => {
    try {
      await dbUpdate(id, toDBPatch({ ...updated, type: updated.type as TxType }));
      await reload();
    } catch (e) {
      console.error("Update failed:", e);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await dbDelete(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderActivePage = () => {
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
            <div className="flex items-center gap-4 md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Quick Add</h2>
              <QuickAddSimple />
              <div className="text-sm opacity-70 mt-1">
                Choose type, date, category, add note & amount → Save (writes to the online database).
              </div>
            </div>

            {loading ? <div>Loading…</div> : renderActivePage()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
