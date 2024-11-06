"use client";

import { useState } from "react";
import { UserSettings } from "@prisma/client";
import { addDays, differenceInDays, startOfMonth } from "date-fns";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { DatePickerWithRange } from "../ui/date-range-picker";
import { currencies, MaxDateRange } from "@/config/constants";
import { Summary } from "./Summary";
import { CategoriesStats } from "@/components/categories/CategoriesStats";
import { TransactionDialog } from "../transactions/TransactionDialog";
import { adjustDateRange } from "@/lib/utils";

interface DateRange {
  from: Date;
  to: Date;
}

export function Overview({ userSettings }: { userSettings: UserSettings }) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: addDays(new Date(), 1),
  });

  const currency = currencies.find(
    (currency) => currency.value === userSettings.currency
  );

  return (
    <div className="w-full flex flex-col gap-y-8 md:gap-y-12">
      <div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 md:mb-0 md:py-8 w-full">
          <p className="text-3xl font-bold w-full md:w-fit">Summary</p>
          <div className="w-full flex flex-wrap gap-2 items-center justify-end">
            <DatePickerWithRange
              className="w-full md:w-auto border-none"
              initialDateFrom={
                adjustDateRange(dateRange.from, dateRange.to).from
              }
              initialDateTo={adjustDateRange(dateRange.from, dateRange.to).to}
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
            <TransactionDialog
              currency={currency!.symbol}
              trigger={
                <Button size="sm">
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
