import prisma from "@/lib/prisma";
import { adjustDateRange, getFormatterForCurrency } from "@/lib/utils";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });

  if (!queryParams.success) {
    return Response.json({ error: queryParams.error.message }, { status: 400 });
  }

  const transactions = await getTransactionsHistory(user.id, queryParams.data.from, queryParams.data.to);

  return Response.json(transactions);
}

export type GetTransactionsHistoryResponse = Awaited<
  ReturnType<typeof getTransactionsHistory>
>;

async function getTransactionsHistory(userId: string, from: Date, to: Date) {
  const { from: startDate, to: endDate } = adjustDateRange(from, to);

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });

  if (!userSettings) {
    throw new Error("User settings not found");
  }

  const formatter = getFormatterForCurrency(userSettings.currency);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return transactions.map((transaction) => ({
    ...transaction,
    amount: formatter.format(transaction.amount),
  }));
}
