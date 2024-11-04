"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import { TransactionType } from "@/types/transaction";
import { CategorySchema, CreateCategorySchema } from "@/schema/categories";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { CheckIcon, Loader2, Plus, PlusSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategory } from "@/app/(dashboard)/_actions/categories";
import { Category } from "@prisma/client";
import { toast } from "sonner";

interface CreateCategoryDialogProps {
  type: TransactionType;
  defaultValue: string;
  onCategoryCreated?: (category: Category) => void;
}

export function CreateCategoryDialog({
  type,
  defaultValue,
  onCategoryCreated,
}: CreateCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateCategorySchema>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
      icon: "💰",
      type,
    },
  });

  useEffect(() => {
    if (defaultValue) {
      form.setValue("name", defaultValue);
    }
  }, [defaultValue, form]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: async (data: Category) => {
      form.reset({
        name: "",
        icon: "💰",
        type,
      });

      toast.success(`Category ${data.name} created successfully!`, {
        id: "create-category",
      });

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      onCategoryCreated?.(data);
      setOpen(false);
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: "create-category",
      });
    },
  });

  const onSubmit = useCallback(
    (values: CreateCategorySchema) => {
      toast.loading("I'm creating the category for you...", {
        id: "create-category",
      });
      mutate(values);
    },
    [mutate],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex border-separate items-center justify-start
          rounded-none border-b p-3 text-muted-foreground"
        >
          <Plus className="h-4 w-4" />
          Criar categoria "{defaultValue}"
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Criar categoria de
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-500" : "text-red-500",
              )}
            >
              {type}
            </span>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex items-end gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>Emoji</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={"outline"} size="icon">
                          {form.watch("icon") ? (
                            <div>{field.value}</div>
                          ) : (
                            <div>💰</div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 border-0">
                        <Picker
                          data={data}
                          theme="light"
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <CheckIcon /> Pronto
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
