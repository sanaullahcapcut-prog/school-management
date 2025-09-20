import { useState } from "react";
import { toYMD } from "../lib/date";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Search, Plus, Edit, Trash2, Download, Calendar as CalendarIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { cn } from "./ui/utils";
import { format } from "./ui/date-utils";
import { generatePDF } from "./ui/pdf-utils";

interface Transaction {
  id: string;
  date: string;  // keep "YYYY-MM-DD"
  amount: number;
  category: string;
  description: string;
  type: "credit" | "debit";
}

interface DebitManagementProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
  onUpdateTransaction: (id: string, transaction: Omit<Transaction, "id">) => void;
  onDeleteTransaction: (id: string) => void;
}

const debitCategories = ["Salary", "Rent", "Bills", "Supplies", "Transport", "Maintenance", "Other"];

// pretty print only (lists). We still STORE/SEND YYYY-MM-DD.
function prettyDMY(ymd: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return ymd;
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
}

export function DebitManagement({
  transactions,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
}: DebitManagementProps) {
  const debitTransactions = transactions
    .filter((t) => t.type === "debit")
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first (safe with YYYY-MM-DD)

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // ❗ Keep form date as "YYYY-MM-DD" (no timezone surprises)
  const [formData, setFormData] = useState({
    date: toYMD(new Date()),
    amount: "",
    category: "",
    description: "",
  });

  // Filter WITHOUT converting strings to Date (avoid TZ flips)
  const filteredTransactions = debitTransactions.filter((t) => {
    const desc = (t.description || "").toLowerCase();
    const cat = (t.category || "").toLowerCase();
    const matchesSearch =
      desc.includes(searchTerm.toLowerCase()) || cat.includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === "all" || t.category === filterCategory;

    let matchesDateRange = true;
    if (dateRange.from && dateRange.to) {
      const txYMD = toYMD(t.date);
      const fromYMD = toYMD(dateRange.from);
      const toYMDStr = toYMD(dateRange.to);
      matchesDateRange = txYMD >= fromYMD && txYMD <= toYMDStr;
    }

    return matchesSearch && matchesCategory && matchesDateRange;
  });

  const handleAddTransaction = () => {
    if (formData.amount && formData.category) {
      onAddTransaction({
        date: formData.date, // keep as YYYY-MM-DD
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        type: "debit",
      });
      setFormData({
        date: toYMD(new Date()),
        amount: "",
        category: "",
        description: "",
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      date: toYMD(transaction.date), // normalize any incoming
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description,
    });
  };

  const handleUpdateTransaction = () => {
    if (editingTransaction && formData.amount && formData.category) {
      onUpdateTransaction(editingTransaction.id, {
        date: formData.date, // keep as YYYY-MM-DD
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        type: "debit",
      });
      setEditingTransaction(null);
      setFormData({
        date: toYMD(new Date()),
        amount: "",
        category: "",
        description: "",
      });
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  const exportToPDF = () => {
    const reportData = {
      title: "Debit Report",
      dateRange: `All debit transactions${
        dateRange.from && dateRange.to
          ? ` from ${format(dateRange.from, "LLL dd, y")} to ${format(dateRange.to, "LLL dd, y")}`
          : filterCategory !== "all"
          ? ` - ${filterCategory} category`
          : ""
      }`,
      transactions: filteredTransactions,
      summary: {
        totalCredit: 0,
        totalDebit: totalAmount,
        balance: -totalAmount,
      },
    };
    generatePDF(reportData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Debit</h1>
          <p className="text-muted-foreground">Manage all debit transactions and expenses</p>
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
                Add Debit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Debit</DialogTitle>
                <DialogDescription>Add a new debit transaction</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTransaction} className="bg-primary hover:bg-primary/90">
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
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
                  {debitCategories.map((category) => (
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
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
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
          {(filterCategory !== "all" || dateRange.from || searchTerm) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {filterCategory !== "all" && (
                <Badge variant="secondary" onClick={() => setFilterCategory("all")} className="cursor-pointer">
                  {filterCategory} ×
                </Badge>
              )}
              {dateRange.from && (
                <Badge
                  variant="secondary"
                  onClick={() => setDateRange({ from: undefined, to: undefined })}
                  className="cursor-pointer"
                >
                  Date Range ×
                </Badge>
              )}
              {searchTerm && (
                <Badge variant="secondary" onClick={() => setSearchTerm("")} className="cursor-pointer">
                  Search ×
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <span>Total Debit Amount:</span>
            <span className="text-xl font-bold text-red-600">{formatCurrency(totalAmount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Debit Transactions ({filteredTransactions.length})</CardTitle>
          <CardDescription>A list of all debit transactions</CardDescription>
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
              {filteredTransactions.map((t) => (
                <TableRow key={t.id}>
                  {/* show what you stored, no new Date() */}
                  <TableCell>{prettyDMY(toYMD(t.date))}</TableCell>
                  <TableCell className="font-medium text-red-600">{formatCurrency(t.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{t.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-48 truncate">{t.description || "-"}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditTransaction(t)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDeleteTransaction(t.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No debit transactions found. Add your first debit transaction above.
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
            <DialogTitle>Edit Debit Transaction</DialogTitle>
            <DialogDescription>Update the debit transaction details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTransaction(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTransaction} className="bg-primary hover:bg-primary/90">
              Update Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DebitManagement;
