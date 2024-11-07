import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { startOfMonth, endOfMonth, startOfToday, eachDayOfInterval, format } from 'date-fns';
import prisma from "@/lib/prisma";
import { Transaction } from "@prisma/client";

interface DailyTransactions {
  date: Date;
  transactions: Transaction[];
  dayTotal: number;
  accumulatedBalance: number;
}

interface TransactionsResponse {
  monthTotal: number;
  days: DailyTransactions[];
}

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) return redirect('/sign-in');

  const transactions = await getMonthlyTransactions(user.id);

  return Response.json(transactions);
}

export type GetTransactionsResponseType = TransactionsResponse;

async function getMonthlyTransactions(userId: string): Promise<TransactionsResponse> {
  const today = startOfToday();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  const daysInMonth = eachDayOfInterval({
    start: monthStart,
    end: monthEnd,
  });

  // Group transactions by day and calculate balances
  const groupedTransactions: DailyTransactions[] = daysInMonth
    .map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayTransactions = transactions.filter(t => 
        format(new Date(t.date), 'yyyy-MM-dd') === dayStr
      );

      const dayTotal = calculateTotal(dayTransactions);
      const previousDaysTransactions = transactions.filter(t => 
        new Date(t.date) <= day
      );
      const accumulatedBalance = calculateTotal(previousDaysTransactions);

      return {
        date: day,
        transactions: dayTransactions,
        dayTotal,
        accumulatedBalance,
      };
    })
    .filter(group => group.transactions.length > 0);

  return {
    monthTotal: calculateTotal(transactions),
    days: groupedTransactions,
  };
}

function calculateTotal(transactions: Transaction[]): number {
  return transactions.reduce((acc, curr) => 
    curr.type === "expense" ? acc - curr.amount : acc + curr.amount,
    0
  );
}