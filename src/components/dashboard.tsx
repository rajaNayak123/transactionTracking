"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionList from "@/components/transactions/transaction-list";
import TransactionForm from "@/components/transactions/transaction-form";
import MonthlyChart from "@/components/charts/monthly-chart";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "../components/overview";
import { RecentTransactions } from "@/components/recent-transactions";
import { formatCurrency } from "@/lib/utils";
import { Transaction, DashboardStats } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    recentTransactions: [],
    monthlyTotals: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Simulate fetching transactions (replace with actual API call)
  useEffect(() => {
    // Simulated data - would normally come from API
    const mockTransactions: Transaction[] = [
      {
        _id: "1",
        amount: 1200,
        date: new Date("2025-04-01"),
        description: "Salary",
        type: "income",
      },
      {
        _id: "2",
        amount: 45.99,
        date: new Date("2025-04-02"),
        description: "Groceries",
        type: "expense",
      },
      {
        _id: "3",
        amount: 35.5,
        date: new Date("2025-04-03"),
        description: "Dinner",
        type: "expense",
      },
      {
        _id: "4",
        amount: 120,
        date: new Date("2025-04-04"),
        description: "Utilities",
        type: "expense",
      },
      {
        _id: "5",
        amount: 200,
        date: new Date("2025-03-15"),
        description: "Freelance work",
        type: "income",
      },
      {
        _id: "6",
        amount: 65.4,
        date: new Date("2025-03-22"),
        description: "Shopping",
        type: "expense",
      },
    ];

    setTransactions(mockTransactions);

    // Calculate statistics
    const totalIncome = mockTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = mockTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate monthly totals for chart
    const monthlyMap = new Map<string, number>();
    mockTransactions.forEach((t) => {
      const date = new Date(t.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      const currentTotal = monthlyMap.get(monthYear) || 0;
      if (t.type === "expense") {
        monthlyMap.set(monthYear, currentTotal + t.amount);
      }
    });

    const monthlyTotals = Array.from(monthlyMap.entries())
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split("/").map(Number);
        const [bMonth, bYear] = b.month.split("/").map(Number);
        return aYear === bYear ? aMonth - bMonth : aYear - bYear;
      });

    setStats({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      recentTransactions: mockTransactions.slice(0, 5),
      monthlyTotals,
    });

    setIsLoading(false);
  }, []);

  const handleAddTransaction = (transaction: Transaction) => {
    // In a real app, we'd call an API endpoint here
    const newTransaction = {
      ...transaction,
      _id: Math.random().toString(36).substr(2, 9),
    };

    setTransactions((prev) => [newTransaction, ...prev]);

    // Update stats
    const newStats = { ...stats };
    if (transaction.type === "income") {
      newStats.totalIncome += transaction.amount;
    } else {
      newStats.totalExpenses += transaction.amount;
    }
    newStats.balance = newStats.totalIncome - newStats.totalExpenses;
    newStats.recentTransactions = [
      newTransaction,
      ...stats.recentTransactions,
    ].slice(0, 5);

    // Update monthly chart data
    const date = new Date(transaction.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    const monthExists = newStats.monthlyTotals.find(
      (m) => m.month === monthYear
    );

    if (transaction.type === "expense") {
      if (monthExists) {
        newStats.monthlyTotals = newStats.monthlyTotals.map((m) =>
          m.month === monthYear
            ? { ...m, total: m.total + transaction.amount }
            : m
        );
      } else {
        newStats.monthlyTotals = [
          ...newStats.monthlyTotals,
          { month: monthYear, total: transaction.amount },
        ].sort((a, b) => {
          const [aMonth, aYear] = a.month.split("/").map(Number);
          const [bMonth, bYear] = b.month.split("/").map(Number);
          return aYear === bYear ? aMonth - bMonth : aYear - bYear;
        });
      }
    }

    setStats(newStats);

    toast({
      title: "Transaction added",
      description: "Your transaction has been added successfully.",
    });
  };

  const handleEditTransaction = (updatedTransaction: Transaction) => {
    // In a real app, we'd call an API endpoint here
    setTransactions((prev) =>
      prev.map((t) =>
        t._id === updatedTransaction._id ? updatedTransaction : t
      )
    );

    toast({
      title: "Transaction updated",
      description: "Your transaction has been updated successfully.",
    });

    // In a real app, we'd recalculate all stats here
  };

  const handleDeleteTransaction = (id: string) => {
    // In a real app, we'd call an API endpoint here
    setTransactions((prev) => prev.filter((t) => t._id !== id));

    toast({
      title: "Transaction deleted",
      description: "Your transaction has been deleted successfully.",
    });

    // In a real app, we'd recalculate all stats here
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Financial Dashboard"
        text="Manage and visualize your personal finances."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(stats.totalIncome)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(stats.totalExpenses)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                stats.balance >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatCurrency(stats.balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="add">Add Transaction</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Monthly Expenses</CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <MonthlyChart data={stats.monthlyTotals} />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your recent financial activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions transactions={stats.recentTransactions} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>
                View, edit, and delete your transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList
                transactions={transactions}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add Transaction</CardTitle>
              <CardDescription>Record a new income or expense</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionForm onSubmit={handleAddTransaction} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
