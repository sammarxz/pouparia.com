"use client";

import { differenceInDays, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { DatePickerWithRange } from "@/components/ui/date-range-picker";

import { currencies, MaxDateRange } from "@/config/constants";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { TransactionDialog } from "@/components/transactions/TransactionDialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { UserSettings } from "@prisma/client";

interface DateRange {
  from: Date;
  to: Date;
}

export default function TransactionsPage() {
  const [currency, setCurrency] = useState<(typeof currencies)[number]>(
    currencies[0]
  );
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const userSettings = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });

  useEffect(() => {
    if (!userSettings.data) return;

    const userCurrency = currencies.find(
      (currency) => currency.value === userSettings.data.currency
    );

    if (userCurrency) {
      setCurrency(userCurrency);
    }
  }, [userSettings.data]);

  return (
    <div className="container flex flex-col gap-6 mb-8 md:mb-0 md:py-8">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <p className="text-3xl font-bold">Transactions</p>
        <div className="flex flex-wrap gap-2">
          <DatePickerWithRange
            className="w-full md:w-auto border-none"
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
          <TransactionDialog
            currency={currency.symbol}
            trigger={
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Transaction
              </Button>
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <TransactionsTable dateRange={dateRange} />
      </div>
    </div>
  );
}
