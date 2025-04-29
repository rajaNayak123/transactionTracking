import { ArrowDownIcon, ArrowUpIcon, CircleDollarSignIcon } from "lucide-react";
import { Transaction } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (!transactions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CircleDollarSignIcon className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No transactions yet</h3>
        <p className="text-sm text-muted-foreground">
          Add your first transaction to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction._id}
          className="flex items-center gap-4 rounded-lg border p-3 transition-all hover:bg-accent"
        >
          <div
            className={`rounded-full p-2 ${
              transaction.type === "income"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            }`}
          >
            {transaction.type === "income" ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : (
              <ArrowDownIcon className="h-4 w-4" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium">{transaction.description}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(transaction.date)}
            </p>
          </div>
          <div
            className={`font-semibold ${
              transaction.type === "income"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {transaction.type === "income" ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}
