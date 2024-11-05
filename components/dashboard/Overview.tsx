"use client";

import { useEffect, useState } from "react";
import { UserSettings } from "@prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { DatePickerWithRange } from "../ui/date-range-picker";
import { CreateTransactionDialog } from "@/components/dashboard/CreateTransactionDialog";
import { MaxDateRange } from "@/config/constants";
import { Summary } from "./Summary";
import { CategoriesStats } from "./CategoriesStats";

interface DateRange {
  from: Date;
  to: Date;
}

export function Overview({ userSettings }: { userSettings: UserSettings }) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <div className="w-full flex flex-col gap-y-8 md:gap-y-12">
      <div>
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6 mb-8 md:mb-0 md:py-8">
          <p className="text-3xl font-bold">Summary</p>
          <div className="w-full md:w-auto flex flex-wrap items-center gap-4">
            <DatePickerWithRange
              className="w-full md:w-auto"
              initialDateFrom={dateRange.from}
              initialDateTo={dateRange.to}
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
                <Button className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  New Transaction
                </Button>
              }
            />
          </div>
        </div>
        <Summary
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
      </div>
      <CategoriesStats
        userSettings={userSettings}
        from={dateRange.from}
        to={dateRange.to}
      />
    </div>
  );
}