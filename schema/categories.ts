import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1),
  type: z.enum(["income", "expense"]),
  icon: z.string().min(1),
});

export type CreateCategorySchema = z.infer<typeof CategorySchema>;

export const SetupCategoriesSchema = z.object({
  incomeCategories: z.array(
    z.object({
      name: z.string(),
      icon: z.string(),
      type: z.literal("income"),
    }),
  ),
  expenseCategories: z.array(
    z.object({
      name: z.string(),
      icon: z.string(),
      type: z.literal("expense"),
    }),
  ),
});
