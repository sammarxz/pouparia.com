"use client";

import { useMemo } from "react";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { DateToUTCDate, getFormatterForCurrency } from "@/lib/utils";
import { SkeletonWrapper } from "../common/SkeletonWrapper";
import { GetCategoryStatsResponseType } from "@/app/api/stats/categories/route";
import { TransactionType } from "@/types/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";

interface CategoriesStatsProps {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

export function CategoriesStats({
  userSettings,
  from,
  to,
}: CategoriesStatsProps) {
  const statsQuery = useQuery<GetCategoryStatsResponseType>({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
          to
        )}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return getFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  console.log(statsQuery.data);

  return (
    <SkeletonWrapper isLoading={statsQuery.isFetching}>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <CategoriesCard
          formatter={formatter}
          type="income"
          data={statsQuery.data || []}
        />
        <CategoriesCard
          formatter={formatter}
          type="expense"
          data={statsQuery.data || []}
        />
      </div>
    </SkeletonWrapper>
  );
}

interface CategoriesCardProps {
  formatter: Intl.NumberFormat;
  type: TransactionType;
  data: GetCategoryStatsResponseType;
}

function CategoriesCard({ formatter, type, data }: CategoriesCardProps) {
  const filteredData = data.filter((item) => item.type === type);
  const total = filteredData.reduce(
    (acc, item) => acc + (item._sum?.amount ?? 0),
    0
  );
  const maxAmount = Math.max(
    ...filteredData.map((item) => item._sum?.amount ?? 0)
  );

  return (
    <Card className="border-none shadow-none p-0">
      <CardHeader className="px-0  pt-0 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="font-medium">
            {type === "income" ? "Incomes" : "Expenses"} by category
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4">
          {filteredData.length === 0 && (
            <div className="flex h-60 w-full flex-col items-center justify-center">
              <p className="text-base text-muted-foreground">
                No data to show for this period
              </p>
              <p className="text-sm">
                try selecting a different date range or adding a new transaction
              </p>
            </div>
          )}

          <ScrollArea className="h-60 w-full">
            <div className="flex w-full flex-col gap-4">
              {filteredData.map((item) => {
                const amount = item._sum?.amount ?? 0;
                const percentage = (amount * 100) / (total || amount);

                return (
                  <div key={item.category} className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span>{item.categoryIcon}</span>
                        <span>{item.category}</span>
                        <span className="text-muted-foreground">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <span className="text-sm">
                        {formatter.format(amount)}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      indicator={
                        type === "income" ? "bg-green-500" : "bg-red-500"
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
