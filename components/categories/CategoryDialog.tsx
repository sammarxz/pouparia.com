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
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { CheckIcon, Loader2, Plus, PencilIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateCategory,
  UpdateCategory,
  DeleteCategory,
} from "@/app/(dashboard)/_actions/categories";
import { Category } from "@prisma/client";
import { toast } from "sonner";
import { VariantProps } from "class-variance-authority";

interface CategoryDialogProps {
  variant?: VariantProps<typeof Button>["variant"];
  type: TransactionType;
  category?: Category;
  defaultValue?: string;
  trigger?: React.ReactNode;
  onComplete?: (category: Category) => void;
}

export function CategoryDialog({
  variant = "ghost",
  type,
  category,
  defaultValue,
  trigger,
  onComplete,
}: CategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const isEditing = Boolean(category);

  const form = useForm<CreateCategorySchema>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: category?.name ?? "",
      icon: category?.icon ?? "💰",
      type,
    },
  });

  useEffect(() => {
    if (defaultValue && !category) {
      form.setValue("name", defaultValue);
    }
  }, [defaultValue, category, form]);

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationKey: ["categories", "create"],
    mutationFn: CreateCategory,
    onSuccess: handleMutationSuccess,
    onError: handleMutationError,
  });

  const updateMutation = useMutation({
    mutationKey: ["categories", "update"],
    mutationFn: UpdateCategory,
    onSuccess: handleMutationSuccess,
    onError: handleMutationError,
  });

  const deleteMutation = useMutation({
    mutationKey: ["categories", "delete"],
    mutationFn: DeleteCategory,
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      setOpen(false);
      onComplete?.(category!);
    },
    onError: () => {
      toast.error("Failed to delete category");
    },
  });

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  function handleMutationSuccess(data: Category) {
    toast.success(
      `Category ${isEditing ? "updated" : "created"} successfully!`,
      { id: "category-mutation" }
    );

    queryClient.invalidateQueries({
      queryKey: ["categories"],
    });

    onComplete?.(data);
    setOpen(false);

    if (!isEditing) {
      form.reset({
        name: "",
        icon: "💰",
        type,
      });
    }
  }

  function handleMutationError() {
    toast.error("Something went wrong", {
      id: "category-mutation",
    });
  }

  const onSubmit = useCallback(
    (values: CreateCategorySchema) => {
      toast.loading(`${isEditing ? "Updating" : "Creating"} category...`, {
        id: "category-mutation",
      });

      if (isEditing && category) {
        updateMutation.mutate({
          currentName: category.name,
          name: values.name,
          icon: values.icon,
          type: values.type,
        });
      } else {
        createMutation.mutate(values);
      }
    },
    [createMutation, updateMutation, isEditing, category]
  );

  const handleDelete = useCallback(() => {
    if (!category) return;

    deleteMutation.mutate({
      name: category.name,
      type: category.type as "income" | "expense",
    });
  }, [category, deleteMutation]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger ?? (
            <Button variant={variant} className="flex items-center gap-2">
              {isEditing ? (
                <PencilIcon className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {isEditing
                ? "Edit category"
                : defaultValue
                ? `Create "${defaultValue}"`
                : "Create category"}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit" : "New"}
              <span
                className={cn(
                  "m-1",
                  type === "income" ? "text-emerald-500" : "text-red-500"
                )}
              >
                {type}
              </span>
              category
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
                    <FormLabel>Category name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter className="">
            <div className="flex gap-2">
              {isEditing && (
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteAlert(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <CheckIcon className="mr-2" />
                    {isEditing ? "Save" : "Create"}
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category "{category?.name}" and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
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
