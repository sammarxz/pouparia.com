import prisma from "@/lib/prisma";
import { getHistoryDataSchema } from "@/schema/history";
import { Period, Timeframe } from "@/types/timeframe";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  const queryParams = getHistoryDataSchema.safeParse({
    timeframe,  
    month,
    year
  });

  if (!queryParams.success) {
    return Response.json({ error: queryParams.error.message }, { status: 400 });
  }

  const historyData = await getHistoryData(user.id, queryParams.data.timeframe, {
    month: queryParams.data.month,
    year: queryParams.data.year,
  });

  return Response.json(historyData);
}

export type GetHistoryDataResponse = Awaited<ReturnType<typeof getHistoryData>>;

async function getHistoryData(userId: string, timeframe: Timeframe, period: Period) {
  switch (timeframe) {
    case "month":
      return await getMonthlyHistoryData(userId, period.month, period.year);
    case "year":
      return await getYearlyHistoryData(userId, period.year);
  }
}

type HistoryData = {
  expense: number;
  income: number;
  month: number;
  year: number;
  day?: number;
}

async function getMonthlyHistoryData(userId: string, month: number, year: number) {
  const result = await prisma.monthHistory.groupBy({
    by: ['day'],
    where: {
      userId,
      month,
      year
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: {
      day: 'asc'
    }
  })

  if (!result.length) {
    return [];
  }

  const history:HistoryData[] = [];
  const daysInMonth = getDaysInMonth(new Date(year, month));

  for (let i = 1; i <= daysInMonth; i++) {
    let expense = 0;
    let income = 0;

    const day = result.find(row => row.day === i);

    if (day) {
      expense = day._sum.expense || 0;
      income = day._sum.income || 0;
    }

    history.push({
      expense,
      income,
      day: i,
      month,
      year,
    })
  }

  return history;
}

async function getYearlyHistoryData(userId: string, year: number) {
  const result = await prisma.yearHistory.groupBy({
    by: ['month'],
    where: {
      userId,
      year
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: {
      month: 'asc'
    }
  })

  if (!result.length) {
    return [];
  }

  const history:HistoryData[] = [];

  for (let i = 0; i < 12; i++) {
    let expense = 0;
    let income = 0;

    const month = result.find(month => month.month === i);

    if (month) {
      expense = month._sum.expense || 0;
      income = month._sum.income || 0;
    }

    history.push({
      expense,
      income,
      month: i,
      year,
    })
  }

  return history;
}



