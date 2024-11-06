// Tremor BarList [v0.1.1]

import React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

type Bar<T> = T & {
  key?: string;
  href?: string;
  value: number;
  name: string;
};

interface BarListProps<T = unknown>
  extends React.HTMLAttributes<HTMLDivElement> {
  data: Bar<T>[];
  valueFormatter?: (value: number) => string;
  showAnimation?: boolean;
  onValueChange?: (payload: Bar<T>) => void;
  sortOrder?: "ascending" | "descending" | "none";
}

function BarListInner<T>(
  {
    data = [],
    valueFormatter = (value) => value.toString(),
    showAnimation = false,
    onValueChange,
    sortOrder = "descending",
    className,
    ...props
  }: BarListProps<T>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>
) {
  const Component = onValueChange ? "button" : "div";
  const sortedData = React.useMemo(() => {
    if (sortOrder === "none") {
      return data;
    }
    return [...data].sort((a, b) => {
      return sortOrder === "ascending" ? a.value - b.value : b.value - a.value;
    });
  }, [data, sortOrder]);

  const widths = React.useMemo(() => {
    const maxValue = Math.max(...sortedData.map((item) => item.value), 0);
    return sortedData.map((item) =>
      item.value === 0 ? 0 : Math.max((item.value / maxValue) * 100, 2)
    );
  }, [sortedData]);

  const rowHeight = "h-8";

  return (
    <div
      ref={forwardedRef}
      className={cn("flex justify-between space-x-6", className)}
      aria-sort={sortOrder}
      tremor-id="tremor-raw"
      {...props}
    >
      <div className="relative w-full space-y-1.5">
        {sortedData.map((item, index) => (
          <Component
            key={item.key ?? item.name}
            onClick={() => {
              onValueChange?.(item);
            }}
            className={cn(
              "group w-full rounded-full",
              onValueChange
                ? [
                    "!-m-0 cursor-pointer",
                    "hover:bg-gray-50 hover:dark:bg-gray-900",
                  ]
                : ""
            )}
          >
            <div
              className={cn(
                "flex items-center rounded-full transition-all",
                rowHeight,
                "bg-neutral-500/10 dark:bg-neutral-900",
                onValueChange
                  ? "group-hover:bg-neutral-200 group-hover:dark:bg-neutral-800"
                  : "",
                {
                  "mb-0": index === sortedData.length - 1,
                  "duration-800": showAnimation,
                }
              )}
              style={{ width: `${widths[index]}%` }}
            >
              <div className={cn("absolute left-1 flex max-w-full pr-2")}>
                {item.href ? (
                  <div>
                    <a
                      href={item.href}
                      className={cn(
                        "truncate whitespace-nowrap rounded-full text-sm",
                        "text-gray-900 dark:text-gray-50",
                        "hover:underline hover:underline-offset-2"
                      )}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Badge
                        variant="outline"
                        className="flex bg-background items-center gap-2 rounded-full"
                      >
                        <span>{(item as any).categoryIcon}</span>
                        {item.name}
                      </Badge>
                    </a>
                  </div>
                ) : (
                  <div>
                    <Badge
                      variant="outline"
                      className="flex bg-background items-center gap-2 rounded-full"
                    >
                      <span>{(item as any).categoryIcon}</span>
                      <span className="truncate whitespace-nowrap text-sm">
                        {item.name}
                      </span>
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </Component>
        ))}
      </div>
      <div>
        {sortedData.map((item, index) => (
          <div
            key={item.key ?? item.name}
            className={cn(
              "flex items-center justify-end",
              rowHeight,
              index === sortedData.length - 1 ? "mb-0" : "mb-1.5"
            )}
          >
            <p
              className={cn(
                "truncate whitespace-nowrap text-sm leading-none",
                "text-gray-900 dark:text-gray-50"
              )}
            >
              {valueFormatter(item.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

BarListInner.displayName = "BarList";

const BarList = React.forwardRef(BarListInner) as <T>(
  p: BarListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof BarListInner>;

export { BarList, type BarListProps };
