import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Search, Plus, Edit, Trash2, Download, TrendingDown, DollarSign } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { cn } from "./ui/utils";
import { format } from "./ui/date-utils";
import { generatePDF } from "./ui/pdf-utils";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: "credit" | "debit";
}

interface ExpensesModuleProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
  onUpdateTransaction: (id: string, transaction: Omit<Transaction, "id">) => void;
  onDeleteTransaction: (id: string) => void;
}

const expenseCategories = ["Salary", "Rent", "Utility Bills", "Supplies", "Transport", "Maintenance", "Insurance", "Equipment", "Other"];

export function ExpensesModule({ 
  transactions, 
  onAddTransaction, 
  onUpdateTransaction, 
  onDeleteTransaction 
}: ExpensesModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: "",
    category: "",
    description: ""
  });

  const expenseTransactions = transactions.filter(t => t.type === "debit");

  const filteredTransactions = expenseTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory;
    
    let matchesDateRange = true;
    if (dateRange.from && dateRange.to) {
      const transactionDate = new Date(transaction.date);
      matchesDateRange = transactionDate >= dateRange.from && transactionDate <= dateRange.to;
    }
    
    return matchesSearch && matchesCategory && matchesDateRange;
  });

  const handleAddExpense = () => {
    if (formData.amount && formData.category) {
      onAddTransaction({
        date: formData.date,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        type: "debit"
      });
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: "",
        category: "",
        description: ""
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      date: transaction.date,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description
    });
  };

  const handleUpdateTransaction = () => {
    if (editingTransaction && formData.amount && formData.category) {
      onUpdateTransaction(editingTransaction.id, {
        date: formData.date,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        type: "debit"
      });
      setEditingTransaction(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: "",
        category: "",
        description: ""
      });
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

  const totalExpenses = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  const getCategoryTotals = () => {
    const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  const categoryTotals = getCategoryTotals();

  const exportToPDF = () => {
    const reportData = {
      title: "Expense Report",
      dateRange: `All expenses${dateRange.from && dateRange.to ? 
        ` from ${format(dateRange.from, "LLL dd, y")} to ${format(dateRange.to, "LLL dd, y")}` : 
        filterCategory !== "all" ? ` - ${filterCategory} category` : ''
      }`,
      transactions: filteredTransactions,
      summary: {
        totalCredit: 0,
        totalDebit: totalExpenses,
        balance: -totalExpenses
      }
    };
    
    generatePDF(reportData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Expenses</h1>
          <p className="text-muted-foreground">
            Track and manage all school expenses
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToPDF} variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Expense</DialogTitle>
                <DialogDescription>
                  Record a new expense transaction
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExpense} className="bg-primary hover:bg-primary/90">
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              Current period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTransactions.length}</div>
            <p className="text-xs text-muted-foreground">
              Total expense records
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. per Transaction</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredTransactions.length > 0 
                ? formatCurrency(totalExpenses / filteredTransactions.length)
                : formatCurrency(0)
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Average expense amount
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categoryTotals[0]?.category || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Highest expense category
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      {categoryTotals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown by Category</CardTitle>
            <CardDescription>
              Total expenses grouped by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryTotals.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-8 bg-red-500 rounded" style={{
                      opacity: 1 - (index * 0.1)
                    }} />
                    <div>
                      <p className="font-medium">{item.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {filteredTransactions.filter(t => t.category === item.category).length} transactions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">{formatCurrency(item.amount)}</p>
                    <p className="text-sm text-muted-foreground">
                      {((item.amount / totalExpenses) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-48 justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Records ({filteredTransactions.length})</CardTitle>
          <CardDescription>
            A detailed list of all expense transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="min-w-[200px]">Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium text-red-600">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-48 truncate">
                      {transaction.description || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTransaction(transaction)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteTransaction(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No expense records found. Add your first expense above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Update the expense transaction details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTransaction(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTransaction} className="bg-primary hover:bg-primary/90">
              Update Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}