"use client";

import { Period, Timeframe } from "@/types/timeframe";
import { useQuery } from "@tanstack/react-query";
import { SkeletonWrapper } from "../common/SkeletonWrapper";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { GetHistoryPeriodsResponseType } from "@/app/api/history-period/route";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface HistoryPeriodSelectorProps {
  timeframe: Timeframe;
  period: Period;
  setTimeframe: (timeframe: Timeframe) => void;
  setPeriod: (period: Period) => void;
}

export default function HistoryPeriodSelector({
  timeframe,
  period,
  setTimeframe,
  setPeriod,
}: HistoryPeriodSelectorProps) {
  const historyPeriods = useQuery<GetHistoryPeriodsResponseType>({
    queryKey: ["overview", "history-periods"],
    queryFn: () => fetch("/api/history-period").then((res) => res.json()),
  });

  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
        <Tabs
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as Timeframe)}
        >
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className="flex flex-wrap items-center gap-4">
        {timeframe === "year" && (
          <SkeletonWrapper
            isLoading={historyPeriods.isFetching}
            fullWidth={false}
          >
            <YearSelector
              period={period}
              setPeriod={setPeriod}
              years={historyPeriods.data || []}
            />
          </SkeletonWrapper>
        )}
        {timeframe === "month" && (
          <SkeletonWrapper
            isLoading={historyPeriods.isFetching}
            fullWidth={false}
          >
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
}

function MonthSelector({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
}) {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) => {
        setPeriod({
          month: parseInt(value),
          year: period.year,
        });
      }}
    >
      <SelectTrigger className="">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
          const monthStr = new Date(0, month).toLocaleString("en", {
            month: "long",
          });

          return (
            <SelectItem key={month} value={month.toString()}>
              {monthStr}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

function YearSelector({
  period,
  setPeriod,
  years,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
  years: GetHistoryPeriodsResponseType;
}) {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        setPeriod({
          month: period.month,
          year: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
