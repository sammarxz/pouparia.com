"use client";

import { UserSettings } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { GetBalanceStatsResponseType } from "@/app/api/stats/route";

import { DateToUTCDate, getFormatterForCurrency } from "@/lib/utils";
import { useEffect, useMemo } from "react";
import { Card, CardContent } from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { SkeletonWrapper } from "../common/SkeletonWrapper";

interface StatsCardProps {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

export function Summary({ userSettings, from, to }: StatsCardProps) {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
    refetchOnWindowFocus: false,
    staleTime: 0, // Reduz o staleTime para forçar o refetch
  });

  const formatter = useMemo(() => {
    return getFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expenses || 0;
  const total = income + expense;
  const balance = income - expense;

  const getPercentage = (value: number) => ((value / total) * 100).toFixed(1);

  return (
    <SkeletonWrapper isLoading={statsQuery.isLoading}>
      <Card className="border-none p-0 shadow-none">
        <CardContent className="p-0 ">
          <div className="flex items-end gap-x-12 gap-y-8">
            {/* Total Balance */}
            <div className="flex flex-col md:flex-row gap-y-8 gap-x-12 md:items-end">
              <div className="flex flex-col gap-2">
                <div className="text-sm text-muted-foreground">
                  Total Balance
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold">
                    {formatter.format(balance)}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col items-end gap-y-2">
              {/* Income and Expenses */}
              <TooltipProvider>
                <div className="mb-2 h-2 w-full rounded-full flex overflow-hidden">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="h-full border-r-2 border-white bg-red-500 hover:brightness-90 transition-all cursor-pointer"
                        style={{
                          width: `${getPercentage(expense)}%`,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Expenses: {formatter.format(expense)}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="h-full bg-green-500 hover:brightness-90 transition-all cursor-pointer"
                        style={{
                          width: `${getPercentage(income)}%`,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Income: {formatter.format(income)}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
              <div className="flex gap-x-8">
                <div className="flex items-center gap-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="text-sm text-muted-foreground">
                    Expenses: {formatter.format(expense)} (
                    {getPercentage(expense)}
                    %)
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="text-sm text-muted-foreground">
                    Income: {formatter.format(income)} ({getPercentage(income)}
                    %)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </SkeletonWrapper>
  );
}
