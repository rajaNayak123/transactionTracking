export interface Transaction {
  _id?: string;
  amount: number;
  date: Date | string;
  description: string;
  type: "income" | "expense";
  category?: string;
}

export interface MonthlyTotal {
  month: string;
  total: number;
}

export interface CategoryTotal {
  category: string;
  total: number;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  recentTransactions: Transaction[];
  monthlyTotals: MonthlyTotal[];
  categoryTotals?: CategoryTotal[];
}
