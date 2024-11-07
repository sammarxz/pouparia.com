"use client";

import { useState, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { ChevronDown, Home, PieChart, Settings } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Transaction, UserSettings } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MobileTransactionDrawer from "./MobileTransactionDrawer";
import { GetTransactionsResponseType } from "@/app/api/transactions/route";
import { ScrollArea } from "../ui/scroll-area";

interface TransactionRowProps {
  transaction: Transaction;
  formatter: Intl.NumberFormat;
}

interface NavButtonProps {
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

interface MobileDashboardProps {
  userSettings: UserSettings;
}

export const MobileDashboard = ({ userSettings }: MobileDashboardProps) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "stats" | "settings">(
    "home"
  );

  const pullThreshold = 200;
  const containerRef = useRef<HTMLDivElement>(null);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: userSettings?.currency || "USD",
  });

  const { data: transactions } = useQuery<GetTransactionsResponseType>({
    queryKey: ["transactions"],
    queryFn: () => fetch("/api/transactions").then((res) => res.json()),
  });

  const [{ y }, api] = useSpring(() => ({ y: 0 }));

  const bind = useDrag(
    ({ movement: [_mx, my], down, cancel }) => {
      if (containerRef.current?.scrollTop || 0 > 0) return;

      if (my > pullThreshold && down) {
        cancel();
        setIsDrawerOpen(true);
        api.start({ y: 0 });
        setIsPulling(false);
      } else if (down) {
        api.start({ y: my > 0 ? my : 0 });
        setIsPulling(my > 0);
      } else {
        api.start({ y: 0 });
        setIsPulling(false);
      }
    },
    {
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
    }
  );

  const progress = y.to([0, pullThreshold], [0, 1]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Pull Indicator */}
      <animated.div
        style={{ height: y.to((v) => Math.max(0, v)) }}
        className="flex items-center justify-center overflow-hidden"
      >
        <animated.div
          style={{
            opacity: progress,
            transform: progress.to((p) => `scale(${0.8 + p * 0.2})`),
          }}
          className="flex flex-col items-center"
        >
          <ChevronDown
            className={cn(
              "w-6 h-6 transition-transform",
              isPulling && "animate-bounce"
            )}
          />
          <span className="text-sm text-muted-foreground">
            {isPulling ? "Release to create" : "Pull to create"}
          </span>
        </animated.div>
      </animated.div>

      {/* Main Content */}
      <animated.main
        {...bind()}
        ref={containerRef}
        style={{ y, touchAction: "pan-x" }}
        className="flex-1 overflow-y-auto overscroll-y-contain"
      >
        <header className="p-4 flex justify-between items-center">
          <div className="w-8" />
          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </header>

        <div className="space-y-6 px-4 h-full">
          <div className="text-center mb-8 h-1/2 flex flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground mb-2">
              Monthly Balance
            </p>
            <p className="text-4xl font-light">
              {formatter.format(transactions?.monthTotal || 0)}
            </p>
          </div>

          <ScrollArea>
            {transactions?.days.map((day, index) => (
              <section key={index} className="mb-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm text-muted-foreground">
                    {format(new Date(day.date), "MMMM d, yyyy")}
                  </h2>
                  <div className="text-right">
                    <span className="text-sm block">
                      {formatter.format(day.dayTotal)}
                    </span>
                  </div>
                </div>
                <div>
                  {day.transactions.map((transaction, tIndex) => (
                    <TransactionRow
                      key={tIndex}
                      transaction={transaction}
                      formatter={formatter}
                    />
                  ))}
                </div>
              </section>
            ))}
          </ScrollArea>
        </div>
      </animated.main>

      {/* Navigation */}
      <nav className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex justify-around py-2">
          <NavButton
            icon={<Home className="w-5 h-5" />}
            isActive={activeTab === "home"}
            onClick={() => setActiveTab("home")}
          />
          <NavButton
            icon={<PieChart className="w-5 h-5" />}
            isActive={activeTab === "stats"}
            onClick={() => setActiveTab("stats")}
          />
          <NavButton
            icon={<Settings className="w-5 h-5" />}
            isActive={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </div>
      </nav>

      <MobileTransactionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};

const TransactionRow = ({ transaction, formatter }: TransactionRowProps) => {
  const { category, categoryIcon, amount, type, description, date } =
    transaction;

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center">
          <span className="text-xl">{categoryIcon}</span>
        </div>
        <div>
          <p className="font-medium">{description}</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{category}</p>
            <span className="text-xs text-muted-foreground">•</span>
            <p className="text-xs text-muted-foreground">
              {format(new Date(date), "h:mm a")}
            </p>
          </div>
        </div>
      </div>
      <div
        className={cn("text-right", type === "income" ? "text-green-500" : "")}
      >
        <p className="font-medium">
          {type === "income" ? "+" : "-"}
          {formatter.format(Math.abs(amount))}
        </p>
      </div>
    </div>
  );
};

const NavButton = ({ icon, isActive, onClick }: NavButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    className={cn(
      "rounded-full",
      isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
    )}
    onClick={onClick}
  >
    {icon}
  </Button>
);
