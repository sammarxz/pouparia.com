"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { UserSettings } from "@prisma/client";

import { Period, Timeframe } from "@/types/timeframe";

import { getFormatterForCurrency } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import HistoryPeriodSelector from "./HistoryPeriodSelector";
import { useQuery } from "@tanstack/react-query";
import { SkeletonWrapper } from "../common/SkeletonWrapper";
import { CustomTooltip } from "../common/CustomTooltip";

export function History({ userSettings }: { userSettings: UserSettings }) {
  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const formatter = useMemo(
    () => getFormatterForCurrency(userSettings.currency),
    [userSettings.currency]
  );

  const historyDataQuery = useQuery({
    queryKey: ["overview", "history-data", timeframe, period],
    queryFn: () =>
      fetch(
        `/api/history-data?timeframe=${timeframe}&month=${period.month}&year=${period.year}`
      ).then((res) => res.json()),
  });

  const dataAvailable =
    historyDataQuery.data && historyDataQuery.data.length > 0;

  return (
    <div className="container">
      <Card className="p-0 border-none shadow-none space-y-8">
        <CardHeader className="p-0">
          <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
            <div className="text-xl font-semibold">
              Transaction&pos;s history
            </div>
            <HistoryPeriodSelector
              timeframe={timeframe}
              period={period}
              setTimeframe={setTimeframe}
              setPeriod={setPeriod}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <SkeletonWrapper isLoading={historyDataQuery.isLoading} fullWidth>
            {dataAvailable ? (
              <ResponsiveContainer width={"100%"} height={300}>
                <BarChart
                  data={historyDataQuery.data}
                  height={300}
                  barCategoryGap={3}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    strokeOpacity={0.2}
                    vertical={false}
                  />
                  <XAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{
                      left: 5,
                      right: 5,
                    }}
                    dataKey={(data) => {
                      const { year, month, day } = data;
                      const date = new Date(year, month, day || 1);

                      if (timeframe === "year") {
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                        });
                      }

                      return date.toLocaleDateString("en-US", {
                        day: "2-digit",
                      });
                    }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar
                    dataKey="income"
                    label="Income"
                    fill="hsla(142.1 70.6% 45.3%)"
                    radius={40}
                    width={30}
                  />
                  <Bar
                    dataKey="expense"
                    label="Expense"
                    fill="hsla(0 84.2% 60.2%)"
                    radius={40}
                    width={30}
                  />
                  <Tooltip
                    cursor={{ opacity: 0.3 }}
                    content={(props) => (
                      <CustomTooltip formatter={formatter} {...props} />
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Card className="flex h-[300px] items-center justify-center">
                <div className="text-sm text-muted-foreground">
                  No data available for the selected period
                </div>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
