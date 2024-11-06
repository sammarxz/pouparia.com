import { cn } from "@/lib/utils";
// import { TooltipProps } from "recharts";
// import { Formatter, NameType, Payload, ValueType } from "recharts/types/component/DefaultTooltipContent";

// interface CustomTooltipProps  {
//   active: boolean | undefined;
//   payload: Payload<any, any>[] | undefined;
//   format: Intl.NumberFormat
// }

export function CustomTooltip({ active, payload, formatter }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const { expense, income } = data;

  return (
    <div className="min-w-[300px] rounded border bg-background p-4">
      <TooltipRow
        formatter={formatter}
        label="Expense"
        value={expense}
        bgColor="bg-red-500"
        textColor="text-red-500"
      />
      <TooltipRow
        formatter={formatter}
        label="Income"
        value={income}
        bgColor="bg-green-500"
        textColor="text-green-500"
      />
      <TooltipRow
        formatter={formatter}
        label="Balance"
        value={income - expense}
        bgColor="bg-neutral-200"
        textColor="text-foreground"
      />
    </div>
  );
}

interface TooltipRowProps {
  formatter: Intl.NumberFormat;
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
}

function TooltipRow({
  formatter,
  label,
  value,
  bgColor,
  textColor,
}: TooltipRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={cn("w-2 h-2 rounded-full", bgColor)} />
        <p className="text-sm">{label}</p>
      </div>
      <p className={cn("text-sm", textColor)}>{formatter.format(value)}</p>
    </div>
  );
}
