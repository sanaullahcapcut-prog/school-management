import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Download, FileText, Calendar, TrendingUp, TrendingDown, Wallet } from "lucide-react";
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

interface ReportsModuleProps {
  transactions: Transaction[];
}

const reportTypes = [
  { value: "account-statement", label: "Account Statement" },
  { value: "credit-report", label: "Credit Report" },
  { value: "debit-report", label: "Debit Report" },
  { value: "salary-report", label: "Salary Report" },
  { value: "expense-report", label: "Expense Report" }
];

export function ReportsModule({ transactions }: ReportsModuleProps) {
  const [selectedReportType, setSelectedReportType] = useState("account-statement");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
    to: new Date()
  });

  const filteredTransactions = transactions.filter(transaction => {
    let matchesDateRange = true;
    if (dateRange.from && dateRange.to) {
      const transactionDate = new Date(transaction.date);
      matchesDateRange = transactionDate >= dateRange.from && transactionDate <= dateRange.to;
    }

    switch (selectedReportType) {
      case "credit-report":
        return matchesDateRange && transaction.type === "credit";
      case "debit-report":
        return matchesDateRange && transaction.type === "debit";
      case "salary-report":
        return matchesDateRange && transaction.type === "debit" && transaction.category.toLowerCase().includes("salary");
      case "expense-report":
        return matchesDateRange && transaction.type === "debit";
      case "account-statement":
      default:
        return matchesDateRange;
    }
  });

  const getReportSummary = () => {
    const totalCredit = filteredTransactions
      .filter(t => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalDebit = filteredTransactions
      .filter(t => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalCredit - totalDebit;
    
    return { totalCredit, totalDebit, balance };
  };

  const { totalCredit, totalDebit, balance } = getReportSummary();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getReportTitle = () => {
    const reportType = reportTypes.find(r => r.value === selectedReportType);
    return reportType?.label || "Report";
  };

  const getReportDescription = () => {
    const fromDate = dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : "";
    const toDate = dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "";
    const dateRangeText = fromDate && toDate ? `${fromDate} - ${toDate}` : "All time";
    
    return `${getReportTitle()} for period: ${dateRangeText}`;
  };

  const exportToPDF = () => {
    // In a real app, this would generate and download a PDF report
    const reportData = {
      title: getReportTitle(),
      dateRange: getReportDescription(),
      summary: { totalCredit, totalDebit, balance },
      transactions: filteredTransactions
    };
    
    generatePDF(reportData);
  };

  const getCategoryBreakdown = () => {
    const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
      const key = `${transaction.type}-${transaction.category}`;
      if (!acc[key]) {
        acc[key] = {
          type: transaction.type,
          category: transaction.category,
          amount: 0,
          count: 0
        };
      }
      acc[key].amount += transaction.amount;
      acc[key].count += 1;
      return acc;
    }, {} as Record<string, { type: string, category: string, amount: number, count: number }>);

    return Object.values(categoryTotals).sort((a, b) => b.amount - a.amount);
  };

  const categoryBreakdown = getCategoryBreakdown();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Reports</h1>
          <p className="text-muted-foreground">
            Generate and export financial reports
          </p>
        </div>
        <Button onClick={exportToPDF} className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>
            Select report type and date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-64 justify-start text-left font-normal",
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

      {/* Report Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credit</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalCredit)}</div>
            <p className="text-xs text-muted-foreground">
              Income for selected period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debit</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDebit)}</div>
            <p className="text-xs text-muted-foreground">
              Expenses for selected period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Net position for period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>
              Transaction summary by category for {getReportTitle().toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryBreakdown.map((item, index) => (
                <div key={`${item.type}-${item.category}`} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      item.type === "credit" 
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-600"
                    }`}>
                      {item.type === "credit" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.count} transaction{item.count !== 1 ? 's' : ''} • {item.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      item.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}>
                      {formatCurrency(item.amount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.type === "credit" 
                        ? ((item.amount / totalCredit) * 100).toFixed(1)
                        : ((item.amount / totalDebit) * 100).toFixed(1)
                      }%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {getReportTitle()}
          </CardTitle>
          <CardDescription>
            {getReportDescription()} • {filteredTransactions.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                {selectedReportType === "account-statement" && (
                  <TableHead className="text-right">Running Balance</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={selectedReportType === "account-statement" ? 6 : 5} className="text-center py-8 text-muted-foreground">
                    No transactions found for the selected criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((transaction, index) => {
                    // Calculate running balance for account statement
                    let runningBalance = 0;
                    if (selectedReportType === "account-statement") {
                      runningBalance = filteredTransactions
                        .slice(0, index + 1)
                        .reduce((sum, t) => {
                          return sum + (t.type === "credit" ? t.amount : -t.amount);
                        }, 0);
                    }

                    return (
                      <TableRow key={transaction.id}>
                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.type === "credit" ? "default" : "destructive"}>
                            {transaction.type === "credit" ? "Credit" : "Debit"}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>
                          <div className="max-w-48 truncate">
                            {transaction.description || "-"}
                          </div>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${
                          transaction.type === "credit" ? "text-green-600" : "text-red-600"
                        }`}>
                          {transaction.type === "credit" ? "+" : "-"}{formatCurrency(transaction.amount)}
                        </TableCell>
                        {selectedReportType === "account-statement" && (
                          <TableCell className={`text-right font-medium ${
                            runningBalance >= 0 ? "text-green-600" : "text-red-600"
                          }`}>
                            {formatCurrency(runningBalance)}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}