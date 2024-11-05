"use client";

import { useEffect, useState } from "react";
import { UserSettings } from "@prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { DateRangePicker } from "../ui/date-range-picker";
import { CreateTransactionDialog } from "@/components/dashboard/CreateTransactionDialog";
import { MaxDateRange } from "@/config/constants";
import { Summary } from "./Summary";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";

interface DateRange {
  from: Date;
  to: Date;
}

export function Overview({ userSettings }: { userSettings: UserSettings }) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["overview", "stats"],
    });
  }, [dateRange, queryClient]);

  return (
    <>
      <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
        <p className="text-3xl font-bold">Summary</p>
        <div className="flex flex-wrap items-center gap-4">
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;

              if (!from || !to) return;
              if (differenceInDays(to, from) > MaxDateRange) {
                toast.error(
                  `The selected range is too long. The maximum allowed is ${MaxDateRange} days.`
                );
                return;
              }

              setDateRange({ from, to });
            }}
          />
          <CreateTransactionDialog
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Transaction
              </Button>
            }
          />
        </div>
      </div>
      <QueryClientProvider client={queryClient}>
        <Summary
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
      </QueryClientProvider>
    </>
  );
}
