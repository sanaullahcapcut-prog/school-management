// Simple date formatting utilities to avoid external dependencies

export function format(date: Date, formatString: string): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const longMonthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  switch (formatString) {
    case 'yyyy-MM-dd':
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    case 'PPP':
      return `${longMonthNames[month - 1]} ${day}, ${year}`;
    case 'LLL dd, y':
      return `${monthNames[month - 1]} ${day.toString().padStart(2, '0')}, ${year}`;
    case 'MMMM d, yyyy':
      return `${longMonthNames[month - 1]} ${day}, ${year}`;
    default:
      return date.toLocaleDateString();
  }
}