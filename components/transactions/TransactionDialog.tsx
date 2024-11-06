"use client";

import { ReactNode, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Calendar } from "../ui/calendar";
import { CategoryPicker } from "../categories/CategoryPicker";

import { cn, currencyStringToNumber, DateToUTCDate } from "@/lib/utils";
import {
  CreateTransaction,
  UpdateTransaction,
  DeleteTransaction,
} from "@/app/(dashboard)/_actions/transactions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { GetTransactionsHistoryResponse } from "@/app/api/transactions-history/route";

interface TransactionDialogProps {
  trigger: ReactNode;
  currency: string;
  transaction?: GetTransactionsHistoryResponse[0];
  onComplete?: () => void;
}

export function TransactionDialog({
  trigger,
  currency,
  transaction,
  onComplete,
}: TransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const isEditing = Boolean(transaction);

  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      amount: transaction?.amount
        ? currencyStringToNumber(transaction.amount)
        : 0,
      description: transaction?.description ?? "",
      date: transaction ? new Date(transaction.date) : new Date(),
      category: transaction?.category ?? "",
      type: (transaction?.type as "income" | "expense") ?? "expense",
    },
  });

  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form]
  );

  const transactionType = form.watch("type");

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const updateMutation = useMutation({
    mutationFn: UpdateTransaction,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const deleteMutation = useMutation({
    mutationFn: DeleteTransaction,
    onSuccess: () => {
      toast.success("Transaction deleted!");
      queryClient.invalidateQueries({ queryKey: ["transactions-history"] });
      queryClient.invalidateQueries({ queryKey: ["overview"] });
      setOpen(false);
      setShowDeleteAlert(false);
      onComplete?.();
    },
    onError: handleError,
  });

  function handleSuccess() {
    toast.success(
      `Transaction ${isEditing ? "updated" : "created"} successfully!`,
      { id: "transaction-mutation" }
    );

    queryClient.invalidateQueries({ queryKey: ["transactions-history"] });
    queryClient.invalidateQueries({ queryKey: ["overview"] });

    form.reset({
      type: transactionType,
      description: "",
      amount: undefined,
      date: new Date(),
      category: undefined,
    });

    setOpen(false);
    onComplete?.();
  }

  function handleError() {
    toast.error("Something went wrong", {
      id: "transaction-mutation",
    });
  }

  const onSubmit = useCallback(
    (values: CreateTransactionSchemaType) => {
      toast.loading(
        `${isEditing ? "Updating" : "Creating"} the transaction...`,
        { id: "transaction-mutation" }
      );

      if (isEditing && transaction) {
        updateMutation.mutate({
          id: transaction.id,
          ...values,
          date: DateToUTCDate(values.date),
        });
      } else {
        createMutation.mutate({
          ...values,
          date: DateToUTCDate(values.date),
        });
      }
    },
    [createMutation, updateMutation, isEditing, transaction]
  );

  const handleDelete = useCallback(() => {
    if (!transaction) return;
    deleteMutation.mutate(transaction.id);
  }, [transaction, deleteMutation]);

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit" : "New"} Transaction</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Amount Input */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <NumericFormat
                        customInput={Input}
                        value={field.value}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue);
                        }}
                        prefix={currency}
                        decimalSeparator=","
                        thousandSeparator="."
                        decimalScale={2}
                        fixedDecimalScale
                        placeholder="0,00"
                        className="font-bold w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Selector */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Date</FormLabel>
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
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setCalendarOpen(false);
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Transaction Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex rounded-lg border p-1">
                      <Button
                        type="button"
                        variant={
                          field.value === "expense" ? "default" : "ghost"
                        }
                        className="flex-1"
                        onClick={() => field.onChange("expense")}
                      >
                        Expense
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "income" ? "default" : "ghost"}
                        className="flex-1"
                        onClick={() => field.onChange("income")}
                      >
                        Income
                      </Button>
                    </div>
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
                    <FormLabel>Transaction Name</FormLabel>
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
                render={() => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={transactionType}
                        onChange={handleCategoryChange}
                        defaultCategory={transaction?.category}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : isEditing ? (
                  "Save Changes"
                ) : (
                  "Create Transaction"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
