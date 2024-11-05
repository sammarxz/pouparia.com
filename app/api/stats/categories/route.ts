import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { OverviewQuerySchema } from "@/schema/overview";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) return redirect('/sign-in');

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });
  if (!queryParams.success) return Response.json({ error: queryParams.error.message }, { status: 400 });

  const stats = await getCategoryStats(user.id, queryParams.data.from, queryParams.data.to);

  return Response.json(stats);
}

export type GetCategoryStatsResponseType = Awaited<ReturnType<typeof getCategoryStats>>;

async function getCategoryStats(userId: string, from: Date, to: Date) {
  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryIcon"],
    where: {
      userId,
      createdAt: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  return stats;
}
