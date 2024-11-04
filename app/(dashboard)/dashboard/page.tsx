import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowUp, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCurrencySymbol } from "@/lib/utils";
import { CreateTransactionDialog } from "@/components/dashboard/CreateTransactionDialog";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect("/wizard");
  }

  const totals = {
    expenses: 87600.34,
    investment: 48500.0,
    savings: 23435.0,
  };

  const total = Object.values(totals).reduce((acc, curr) => acc + curr, 0);

  const getPercentage = (value: number) => ((value / total) * 100).toFixed(1);

  const currency = getCurrencySymbol(userSettings.currency);

  return (
    <div className="h-full bg-background">
      <div className="">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="text-3xl font-bold">Sumário</p>
          <div className="flex flex-wrap items-center gap-4">
            <CreateTransactionDialog
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova transação
                </Button>
              }
            />
          </div>
        </div>

        <Card className="border-none p-0 shadow-none">
          <CardContent className="p-0">
            <div className="space-y-8">
              {/* Net Total */}
              <div className="flex flex-col md:flex-row gap-y-8 gap-x-12 md:items-end">
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-muted-foreground">
                    Total Líquido
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold">
                      <span className="mr-2">{currency}</span>
                      218.493,21
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <TooltipProvider>
                  <div className="mb-1.5 h-2 w-full rounded-full flex overflow-hidden">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="h-full border-r-2 border-white bg-red-500 hover:brightness-90 transition-all cursor-pointer"
                          style={{
                            width: `${getPercentage(totals.expenses)}%`,
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Despesas: {totals.expenses.toLocaleString()}€</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="h-full border-r-2 border-white bg-indigo-500 hover:brightness-90 transition-all cursor-pointer"
                          style={{
                            width: `${getPercentage(totals.investment)}%`,
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Investimentos: {totals.investment.toLocaleString()}€
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="h-full bg-yellow-500 hover:brightness-90 transition-all cursor-pointer"
                          style={{ width: `${getPercentage(totals.savings)}%` }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Economias: {totals.savings.toLocaleString()}€</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <StatCard
                  label="Receitas"
                  currency={currency}
                  value="135.780,47"
                  color="text-green-500"
                />
                <StatCard
                  label="Despesas"
                  currency={currency}
                  value="87.600,34"
                  color="text-red-500"
                  percentage="73%"
                />
                <StatCard
                  label="Investimentos"
                  currency={currency}
                  value="48.500,00"
                  color="text-indigo-500"
                  percentage="21%"
                />
                <StatCard
                  label="Economias"
                  currency={currency}
                  value="23.435,00"
                  color="text-yellow-500"
                  percentage="6%"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
