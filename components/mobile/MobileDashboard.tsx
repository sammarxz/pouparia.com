"use client";

import { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  PanInfo,
} from "framer-motion";
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

  const y = useMotionValue(0);
  const pullProgress = useTransform(y, [0, pullThreshold], [0, 1]);
  const scale = useTransform(pullProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(pullProgress, [0, 1], [0, 1]);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: userSettings?.currency || "USD",
  });

  const { data: transactions } = useQuery<GetTransactionsResponseType>({
    queryKey: ["transactions"],
    queryFn: () => fetch("/api/transactions").then((res) => res.json()),
  });

  const handleDragStart = () => {
    if (containerRef.current?.scrollTop && containerRef.current.scrollTop > 0) {
      return false;
    }
  };

  const handleDrag = (_: any, info: PanInfo) => {
    const newY = Math.max(0, info.offset.y);
    y.set(newY);
    setIsPulling(newY > 0);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > pullThreshold) {
      setIsDrawerOpen(true);
    }
    animate(y, 0, { type: "spring", bounce: 0.3 });
    setIsPulling(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Pull Indicator */}
      <motion.div
        style={{ height: y }}
        className="flex items-center justify-center overflow-hidden"
      >
        <motion.div
          style={{
            opacity,
            scale,
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
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.main
        ref={containerRef}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.5}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="flex-1 overflow-y-auto overscroll-y-contain touch-pan-y"
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
              <section key={index} className="py-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm text-muted-foreground">
                    {format(new Date(day.date), "MMMM d, yyyy")}
                  </h2>
                  <div className="text-right">
                    <span className="text-sm block text-muted-foreground">
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
      </motion.main>

      {/* Navigation */}
      <nav
        className="h-16 border-t flex items-center justify-center bg-background/80 backdrop-blur 
      supports-[backdrop-filter]:bg-background/60"
      >
        <div className="w-full flex justify-around">
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
    <div className="flex items-center justify-between mt-4">
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
      isActive ? "text-primary" : "text-muted-foreground"
    )}
    onClick={onClick}
  >
    {icon}
  </Button>
);
