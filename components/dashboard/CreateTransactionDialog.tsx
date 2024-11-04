"use client";

import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";

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
import { CategoryComboBox } from "../categories/CategoryComboBox";
import { CategoryPicker } from "../categories/CategoryPicker";

export function CreateTransactionDialog({ trigger }: { trigger: ReactNode }) {
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

  const onSubmit = (data: CreateTransactionSchemaType) => {
    console.log(data);
    // Handle form submission
  };

  const handleCreateCategory = (name: string, icon: string) => {
    form.setValue("category", name);
    // Additional logic for creating a new category if needed
  };

  const transactionType = form.watch("type");

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Nova Transação</DialogTitle>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Amount Input */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      className="text-4xl font-bold text-center h-20 px-12 border-none shadow-none"
                      placeholder="0,00"
                      {...field}
                    />
                  </FormControl>
                  <span className="absolute left-4 top-8 -translate-y-1/2 text-4xl font-bold text-muted-foreground">
                    R$
                  </span>
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-between text-left font-normal"
                        >
                          <span>
                            {format(field.value, "PPP", { locale: pt })}
                          </span>
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
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
                      variant={field.value === "expense" ? "default" : "ghost"}
                      className="flex-1"
                      onClick={() => field.onChange("expense")}
                    >
                      Despesa
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "income" ? "default" : "ghost"}
                      className="flex-1"
                      onClick={() => field.onChange("income")}
                    >
                      Receita
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
                  <FormLabel>Descrição</FormLabel>
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
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <CategoryPicker type={transactionType} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg">
              Adicionar Transação
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
