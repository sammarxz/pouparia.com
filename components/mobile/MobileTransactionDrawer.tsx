"use-client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CategoryPicker } from "@/components/categories/CategoryPicker";
import { cn } from "@/lib/utils";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { CreateTransaction } from "@/app/(dashboard)/_actions/transactions";

interface MobileTransactionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type TransactionType = "expense" | "income";

export default function MobileTransactionDrawer({
  isOpen,
  onClose,
}: MobileTransactionDrawerProps) {
  const [transactionType, setTransactionType] =
    useState<TransactionType>("expense");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      amount: 0,
      description: "",
      date: new Date(),
      category: "",
      type: "expense",
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: () => {
      toast.success("Transaction added!", {
        id: "create-transaction",
      });

      form.reset({
        type: transactionType,
        description: "",
        amount: 0,
        date: new Date(),
        category: "",
      });

      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      onClose();
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: "create-transaction",
      });
    },
  });

  const onSubmit = (values: CreateTransactionSchemaType) => {
    toast.loading("Adding transaction...", {
      id: "create-transaction",
    });

    mutate({
      ...values,
      type: transactionType,
    });
  };

  const handleTransactionTypeChange = (type: TransactionType) => {
    setTransactionType(type);
    form.setValue("type", type);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[96vh]">
        <DrawerHeader>
          <DrawerTitle className="text-center">New Transaction</DrawerTitle>
        </DrawerHeader>

        <div className="px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Transaction Type Toggle */}
              <div className="flex rounded-lg border p-1">
                <Button
                  type="button"
                  variant={transactionType === "expense" ? "default" : "ghost"}
                  className="flex-1"
                  onClick={() => handleTransactionTypeChange("expense")}
                >
                  Expense
                </Button>
                <Button
                  type="button"
                  variant={transactionType === "income" ? "default" : "ghost"}
                  className="flex-1"
                  onClick={() => handleTransactionTypeChange("income")}
                >
                  Income
                </Button>
              </div>

              {/* Amount Input */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <NumericFormat
                        customInput={Input}
                        value={value}
                        onValueChange={(values) => {
                          onChange(values.floatValue);
                        }}
                        prefix="$ "
                        decimalSeparator="."
                        thousandSeparator=","
                        decimalScale={2}
                        fixedDecimalScale
                        placeholder="0.00"
                        className="text-lg font-bold"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={transactionType}
                        onChange={(value: string) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Picker */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Choose a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date: Date | undefined) => {
                            if (date) {
                              field.onChange(date);
                              setCalendarOpen(false);
                            }
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <DrawerFooter className="px-0">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Adding...
                    </div>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Transaction
                    </>
                  )}
                </Button>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
