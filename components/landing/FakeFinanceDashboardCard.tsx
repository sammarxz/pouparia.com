"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useTransform,
  animate,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  EllipsisVerticalIcon,
  Plus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TransactionData {
  month: string;
  income: number;
  expenses: number;
}

interface Toast {
  id: number;
  title: string;
  amount: number;
  category: string;
  emoji: string;
}

const getRandomTransaction = () => {
  const transactions = [
    {
      title: "Food Delivery",
      emoji: "🍕",
      category: "Food & Drinks",
      type: "expense",
      amount: () => -generateRandomAmount(20, 100),
    },
    {
      title: "Salary",
      emoji: "💰",
      category: "Income",
      type: "income",
      amount: () => generateRandomAmount(3000, 5000),
    },
    {
      title: "Shopping",
      emoji: "🛍️",
      category: "Shopping",
      type: "expense",
      amount: () => -generateRandomAmount(50, 200),
    },
    {
      title: "Freelance",
      emoji: "💻",
      category: "Income",
      type: "income",
      amount: () => generateRandomAmount(500, 1500),
    },
    {
      title: "Transport",
      emoji: "🚗",
      category: "Transportation",
      type: "expense",
      amount: () => -generateRandomAmount(10, 50),
    },
    {
      title: "Investment",
      emoji: "📈",
      category: "Income",
      type: "income",
      amount: () => generateRandomAmount(100, 1000),
    },
    {
      title: "Coffee",
      emoji: "☕",
      category: "Food & Drinks",
      type: "expense",
      amount: () => -generateRandomAmount(5, 15),
    },
    {
      title: "Bonus",
      emoji: "🎉",
      category: "Income",
      type: "income",
      amount: () => generateRandomAmount(1000, 2000),
    },
    {
      title: "Healthcare",
      emoji: "🏥",
      category: "Health",
      type: "expense",
      amount: () => -generateRandomAmount(50, 300),
    },
  ];

  return transactions[Math.floor(Math.random() * transactions.length)];
};

const generateRandomAmount = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const Counter = ({
  value,
  prefix = "$",
}: {
  value: number;
  prefix?: string;
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return latest.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  });

  useEffect(() => {
    const animation = animate(count, value, {
      type: "spring",
      duration: 1,
      bounce: 0.1,
    });

    return animation.stop;
  }, [count, value]);

  return (
    <div className="tabular-nums">
      {prefix}
      <motion.span>{rounded}</motion.span>
    </div>
  );
};

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const Toast = ({ toast }: { toast: Toast }) => (
  <AnimatePresence mode="wait">
    <div className="absolute inset-0 flex items-start justify-start">
      <motion.div
        key={toast.id}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-xs mx-auto"
      >
        <Card className="relative">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <span className="text-lg">{toast.emoji}</span>
                </motion.div>
                <div className="flex-1 w-full flex items-start justify-start flex-col">
                  <p className="text-sm font-medium text-gray-900">
                    {toast.title}
                  </p>
                  <p className="text-xs text-gray-500">{toast.category}</p>
                </div>
              </div>
              <motion.p
                className={`text-sm font-medium ${
                  toast.amount > 0 ? "text-lime-500" : "text-red-500"
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                {toast.amount > 0 ? "+" : ""}
                {toast.amount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </motion.p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  </AnimatePresence>
);

const StatisticBadge = ({ change }: { change: number }) => (
  <motion.div
    className={`flex items-center space-x-1 text-sm ${
      change >= 0 ? "text-lime-500" : "text-red-500"
    }`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring" }}
  >
    {change >= 0 ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    )}
    <span>{Math.abs(change).toFixed(1)}%</span>
  </motion.div>
);

export function FakeFinanceDashboardCard() {
  const [toast, setToast] = useState<Toast | null>(null);
  const [totalBalance, setTotalBalance] = useState(28000.0);
  const [lastMonthBalance, setLastMonthBalance] = useState(25500.0);
  const [totalIncome, setTotalIncome] = useState(35450.75);
  const [lastMonthIncome, setLastMonthIncome] = useState(32000.0);
  const [totalExpenses, setTotalExpenses] = useState(7450.75);
  const [lastMonthExpenses, setLastMonthExpenses] = useState(6500.0);

  const [monthlyData, setMonthlyData] = useState<TransactionData[]>([
    { month: "May", income: 30800, expenses: 5200 },
    { month: "Jun", income: 31100, expenses: 5800 },
    { month: "Jul", income: 32550, expenses: 6100 },
    { month: "Aug", income: 32000, expenses: 6500 },
    { month: "Sep", income: 32000, expenses: 6500 },
    { month: "Oct", income: 35450, expenses: 7450 },
  ]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAddTransaction = () => {
    const transaction = getRandomTransaction();
    const amount = transaction.amount();

    // Update historical values
    setLastMonthBalance(totalBalance);
    setLastMonthIncome(totalIncome);
    setLastMonthExpenses(totalExpenses);

    // Update current values
    setTotalBalance((prev) => prev + amount);

    if (amount > 0) {
      setTotalIncome((prev) => prev + amount);
    } else {
      setTotalExpenses((prev) => prev + Math.abs(amount));
    }

    // Show toast
    setToast({
      id: Date.now(),
      title: transaction.title,
      amount: amount,
      category: transaction.category,
      emoji: transaction.emoji,
    });

    // Update chart data
    const updatedData = [...monthlyData];
    const currentMonth = updatedData[updatedData.length - 1];
    if (amount > 0) {
      currentMonth.income += amount;
    } else {
      currentMonth.expenses += Math.abs(amount);
    }
    setMonthlyData(updatedData);
  };

  const balanceChange =
    ((totalBalance - lastMonthBalance) / lastMonthBalance) * 100;
  const incomeChange =
    ((totalIncome - lastMonthIncome) / lastMonthIncome) * 100;
  const expensesChange =
    ((totalExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;

  return (
    <Card className="w-full relative h-fit">
      {toast && <Toast toast={toast} />}
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start justify-start gap-1">
            <CardTitle>Total Balance</CardTitle>
            <CardDescription>May - October 2024</CardDescription>
          </div>
          <EllipsisVerticalIcon className="w-4 h-4 " />
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex gap-4 justify-between">
          <div className="flex flex-col gap-1">
            <div className="text-3xl font-medium">
              <Counter value={totalBalance} />
            </div>
            <div className="flex gap-2 text-sm">
              <StatisticBadge change={balanceChange} />
              <span className="text-neutral-500">last month</span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-1">
              <ArrowDownLeftIcon className="w-4 h-4 text-lime-300" />
              <div className="text-neutral-900">
                <Counter value={totalIncome} />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ArrowUpRightIcon className="w-4 h-4 text-emerald-900" />
              <div className="text-neutral-500">
                <Counter value={totalExpenses} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Chart */}
        <div className="h-fit">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-900">Last 6 Months</p>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                <span className="text-gray-500">Income</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-gray-500">Expenses</span>
              </div>
            </div>
          </div>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={monthlyData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>

      <CardFooter>
        <motion.div
          className="w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            className="w-full py-6 text-base"
            onClick={handleAddTransaction}
            variant="default"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  );
}
