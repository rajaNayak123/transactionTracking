"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MonthlyTotal } from "@/lib/types";
import { formatMonthName, formatCurrency } from "@/lib/utils";

interface MonthlyChartProps {
  data: MonthlyTotal[];
}

export default function MonthlyChart({ data }: MonthlyChartProps) {
  const { theme } = useTheme();
  const [chartData, setChartData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  // Format data for chart
  useEffect(() => {
    const formattedData = data.map((item) => ({
      name: formatMonthName(item.month),
      amount: item.total,
    }));
    setChartData(formattedData);
  }, [data]);

  // Wait until component is mounted to access theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Get theme colors
  const getBarColor = () => {
    return theme === "dark" ? "hsl(var(--chart-1))" : "hsl(var(--chart-1))";
  };

  const getAxisColor = () => {
    return theme === "dark"
      ? "hsl(var(--muted-foreground))"
      : "hsl(var(--muted-foreground))";
  };

  return (
    <div className="h-[300px] w-full mt-4">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            className="transition-all duration-300"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="name"
              stroke={getAxisColor()}
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              stroke={getAxisColor()}
              tick={{ fontSize: 12 }}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value)), "Expenses"]}
              contentStyle={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend wrapperStyle={{ marginTop: 10 }} />
            <Bar
              dataKey="amount"
              name="Expenses"
              fill={getBarColor()}
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">No expense data available</p>
        </div>
      )}
    </div>
  );
}
