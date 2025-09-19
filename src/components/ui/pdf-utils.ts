// PDF Generation utility for financial reports

interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: "credit" | "debit";
}

interface ReportData {
  title: string;
  dateRange: string;
  transactions: Transaction[];
  summary?: {
    totalCredit: number;
    totalDebit: number;
    balance: number;
  };
}

export function generatePDF(reportData: ReportData) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Create HTML content for the PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${reportData.title}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 40px; 
          color: #333;
          line-height: 1.6;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 2px solid #2d5a2d;
          padding-bottom: 20px;
        }
        .school-name { 
          color: #2d5a2d; 
          font-size: 24px; 
          font-weight: bold; 
          margin: 0;
        }
        .report-title { 
          color: #666; 
          font-size: 18px; 
          margin: 5px 0;
        }
        .date-range { 
          color: #888; 
          font-size: 14px; 
          margin-top: 10px;
        }
        .summary { 
          background: #f8f9fa; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0;
          border-left: 4px solid #2d5a2d;
        }
        .summary-row { 
          display: flex; 
          justify-content: space-between; 
          margin: 10px 0;
          padding: 5px 0;
        }
        .summary-row.total { 
          border-top: 2px solid #2d5a2d; 
          font-weight: bold; 
          font-size: 16px;
          margin-top: 15px;
          padding-top: 15px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 20px;
          background: white;
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 12px 8px; 
          text-align: left;
        }
        th { 
          background-color: #2d5a2d; 
          color: white; 
          font-weight: bold;
        }
        tr:nth-child(even) { 
          background-color: #f9f9f9; 
        }
        .credit { color: #10b981; font-weight: bold; }
        .debit { color: #ef4444; font-weight: bold; }
        .amount { text-align: right; }
        .footer { 
          margin-top: 40px; 
          text-align: center; 
          color: #666; 
          font-size: 12px;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        .no-data {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 40px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="school-name">One Ummah School</h1>
        <h2 class="report-title">${reportData.title}</h2>
        <p class="date-range">${reportData.dateRange}</p>
      </div>

      ${reportData.summary ? `
        <div class="summary">
          <h3 style="margin-top: 0; color: #2d5a2d;">Financial Summary</h3>
          <div class="summary-row">
            <span>Total Credit (Income):</span>
            <span class="credit">${formatCurrency(reportData.summary.totalCredit)}</span>
          </div>
          <div class="summary-row">
            <span>Total Debit (Expenses):</span>
            <span class="debit">${formatCurrency(reportData.summary.totalDebit)}</span>
          </div>
          <div class="summary-row total">
            <span>Net Balance:</span>
            <span class="${reportData.summary.balance >= 0 ? 'credit' : 'debit'}">
              ${formatCurrency(reportData.summary.balance)}
            </span>
          </div>
        </div>
      ` : ''}

      ${reportData.transactions.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.transactions.map(transaction => `
              <tr>
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td>
                  <span class="${transaction.type}">
                    ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </span>
                </td>
                <td>${transaction.category}</td>
                <td>${transaction.description || '-'}</td>
                <td class="amount ${transaction.type}">
                  ${transaction.type === 'credit' ? '+' : '-'}${formatCurrency(transaction.amount)}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : `
        <div class="no-data">
          <p>No transactions found for the selected criteria.</p>
        </div>
      `}

      <div class="footer">
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p>One Ummah School Finance Management System</p>
      </div>
    </body>
    </html>
  `;

  // Create and download the PDF
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = function() {
      printWindow.print();
      // Close the window after printing (optional)
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };
  }
}

export function downloadCSV(reportData: ReportData) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  let csvContent = '';
  
  // Add header
  csvContent += `"${reportData.title}"\n`;
  csvContent += `"${reportData.dateRange}"\n`;
  csvContent += '\n';
  
  // Add summary if available
  if (reportData.summary) {
    csvContent += '"Financial Summary"\n';
    csvContent += `"Total Credit","${formatCurrency(reportData.summary.totalCredit)}"\n`;
    csvContent += `"Total Debit","${formatCurrency(reportData.summary.totalDebit)}"\n`;
    csvContent += `"Net Balance","${formatCurrency(reportData.summary.balance)}"\n`;
    csvContent += '\n';
  }
  
  // Add transactions header
  csvContent += '"Date","Type","Category","Description","Amount"\n';
  
  // Add transactions
  reportData.transactions.forEach(transaction => {
    const amount = `${transaction.type === 'credit' ? '+' : '-'}${formatCurrency(transaction.amount)}`;
    csvContent += `"${new Date(transaction.date).toLocaleDateString()}","${transaction.type}","${transaction.category}","${transaction.description || ''}","${amount}"\n`;
  });

  // Create and download CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${reportData.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}