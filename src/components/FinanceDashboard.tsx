import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Wallet, TrendingUp, TrendingDown, Plus, X } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: "credit" | "debit";
}

interface FinanceDashboardProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
}

const creditCategories = ["Fee", "Donation", "Grant", "Other"];
const debitCategories = ["Salary", "Rent", "Bills", "Supplies", "Other"];

export function FinanceDashboard({ transactions, onAddTransaction }: FinanceDashboardProps) {
  const [isCreditDialogOpen, setIsCreditDialogOpen] = useState(false);
  const [isDebitDialogOpen, setIsDebitDialogOpen] = useState(false);
  const [creditForm, setCreditForm] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: "",
    category: "",
    description: ""
  });
  const [debitForm, setDebitForm] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: "",
    category: "",
    description: ""
  });

  const totalCredit = transactions
    .filter(t => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter(t => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalCredit - totalDebit;

  const handleCreditSubmit = () => {
    if (creditForm.amount && creditForm.category) {
      onAddTransaction({
        date: creditForm.date,
        amount: parseFloat(creditForm.amount),
        category: creditForm.category,
        description: creditForm.description,
        type: "credit"
      });
      setCreditForm({
        date: new Date().toISOString().split('T')[0],
        amount: "",
        category: "",
        description: ""
      });
      setIsCreditDialogOpen(false);
    }
  };

  const handleDebitSubmit = () => {
    if (debitForm.amount && debitForm.category) {
      onAddTransaction({
        date: debitForm.date,
        amount: parseFloat(debitForm.amount),
        category: debitForm.category,
        description: debitForm.description,
        type: "debit"
      });
      setDebitForm({
        date: new Date().toISOString().split('T')[0],
        amount: "",
        category: "",
        description: ""
      });
      setIsDebitDialogOpen(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of school financial status
        </p>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Balance</CardTitle>
            <Wallet className="h-4 w-4 text-white/90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
            <p className="text-xs text-white/70 mt-1">
              Current available balance
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Credit</CardTitle>
            <TrendingUp className="h-4 w-4 text-white/90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCredit)}</div>
            <p className="text-xs text-white/70 mt-1">
              Total income received
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Debit</CardTitle>
            <TrendingDown className="h-4 w-4 text-white/90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDebit)}</div>
            <p className="text-xs text-white/70 mt-1">
              Total expenses paid
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-end gap-4">
        <Dialog open={isCreditDialogOpen} onOpenChange={setIsCreditDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              Credit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Credit</DialogTitle>
              <DialogDescription>
                Add a new credit transaction
              </DialogDescription>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-4"
                onClick={() => setIsCreditDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="credit-date">Date</Label>
                <Input
                  id="credit-date"
                  type="date"
                  value={creditForm.date}
                  onChange={(e) => setCreditForm({...creditForm, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credit-amount">Amount</Label>
                <Input
                  id="credit-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={creditForm.amount}
                  onChange={(e) => setCreditForm({...creditForm, amount: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credit-category">Category</Label>
                <Select value={creditForm.category} onValueChange={(value) => setCreditForm({...creditForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {creditCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="credit-description">Description</Label>
                <Textarea
                  id="credit-description"
                  placeholder="Enter description"
                  value={creditForm.description}
                  onChange={(e) => setCreditForm({...creditForm, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreditSubmit} className="bg-primary hover:bg-primary/90">
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDebitDialogOpen} onOpenChange={setIsDebitDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              Debit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Debit</DialogTitle>
              <DialogDescription>
                Add a new debit transaction
              </DialogDescription>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-4"
                onClick={() => setIsDebitDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="debit-date">Date</Label>
                <Input
                  id="debit-date"
                  type="date"
                  value={debitForm.date}
                  onChange={(e) => setDebitForm({...debitForm, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="debit-amount">Amount</Label>
                <Input
                  id="debit-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={debitForm.amount}
                  onChange={(e) => setDebitForm({...debitForm, amount: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="debit-category">Category</Label>
                <Select value={debitForm.category} onValueChange={(value) => setDebitForm({...debitForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {debitCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="debit-description">Description</Label>
                <Textarea
                  id="debit-description"
                  placeholder="Enter description"
                  value={debitForm.description}
                  onChange={(e) => setDebitForm({...debitForm, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleDebitSubmit} className="bg-primary hover:bg-primary/90">
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions recorded yet. Add your first transaction using the buttons above.
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.slice(-5).reverse().map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.type === "credit" 
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-600"
                    }`}>
                      {transaction.type === "credit" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description || transaction.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === "credit" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.type === "credit" ? "+" : "-"}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}