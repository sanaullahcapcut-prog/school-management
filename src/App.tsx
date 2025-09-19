import { useState } from "react";
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

interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: "credit" | "debit";
}

type ActivePage =
  | "dashboard"
  | "credit"
  | "debit"
  | "expenses"
  | "reports";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] =
    useState<ActivePage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [transactions, setTransactions] = useState<
    Transaction[]
  >([
    // Sample data
    {
      id: "1",
      date: "2024-12-15",
      amount: 50000,
      category: "Fee",
      description: "Student fees for December",
      type: "credit",
    },
    {
      id: "2",
      date: "2024-12-14",
      amount: 25000,
      category: "Salary",
      description: "Teacher salary payment",
      type: "debit",
    },
    {
      id: "3",
      date: "2024-12-13",
      amount: 5000,
      category: "Bills",
      description: "Electricity bill payment",
      type: "debit",
    },
  ]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleAddTransaction = (
    transaction: Omit<Transaction, "id">,
  ) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const handleUpdateTransaction = (
    id: string,
    updatedTransaction: Omit<Transaction, "id">,
  ) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id ? { ...updatedTransaction, id } : t,
      ),
    );
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <FinanceDashboard
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
          />
        );
      case "credit":
        return (
          <CreditManagement
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onUpdateTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case "debit":
        return (
          <DebitManagement
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onUpdateTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case "expenses":
        return (
          <ExpensesModule
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onUpdateTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case "reports":
        return <ReportsModule transactions={transactions} />;
      default:
        return (
          <FinanceDashboard
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
          />
        );
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
          <div className="container mx-auto p-6">
            <div className="flex items-center gap-4 mb-6 md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
            {renderActivePage()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}