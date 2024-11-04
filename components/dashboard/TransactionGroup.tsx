import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export function TransactionGroup({ title, transactions }) {
  return (
    <div className="space-y-2">
      <div className="font-medium">{title}</div>
      <div className="space-y-2">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <img src="/api/placeholder/20/20" alt={transaction.category} />
              </div>
              <div>
                <div className="font-medium">{transaction.name}</div>
                <div className="text-sm text-muted-foreground">
                  {transaction.category}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={transaction.amount > 0 ? "text-green-500" : ""}>
                {transaction.amount > 0 ? "+" : ""}
                {transaction.amount.toFixed(2)}€
              </span>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
