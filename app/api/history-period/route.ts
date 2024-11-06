import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const periods = await getHistoryPeriods(user.id);

  return Response.json(periods);
}

export type GetHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

async function getHistoryPeriods(userId: string) {
  const result = await prisma.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: {
      year: "desc",
    },
  });

  const years = result.map((item) => item.year);
  if (years.length === 0) {
    return [new Date().getFullYear()];
  }

  return years;
}
