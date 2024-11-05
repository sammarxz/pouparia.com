"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  initialDateFrom: Date;
  initialDateTo: Date;
  onUpdate: (values: { range: DateRange }) => void;
}

export function DatePickerWithRange({
  className,
  initialDateFrom,
  initialDateTo,
  onUpdate,
}: DatePickerWithRangeProps) {
  // Remova o useEffect e atualize diretamente no onSelect do Calendar
  const [date, setDate] = React.useState<DateRange>({
    from: initialDateFrom,
    to: initialDateTo,
  });

  // Função para lidar com a seleção de datas
  const handleSelect = (newDate: DateRange | undefined) => {
    if (!newDate) return;

    setDate(newDate);

    // Só notifica o componente pai se tivermos ambas as datas
    if (newDate.from && newDate.to) {
      onUpdate({ range: newDate });
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
