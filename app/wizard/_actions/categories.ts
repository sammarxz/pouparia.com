"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

import { SetupCategoriesSchema } from "@/schema/categories";
import { CategoryInput } from "@/types/category";

interface SetupCategoriesInput {
  incomeCategories: CategoryInput[];
  expenseCategories: CategoryInput[];
}

export async function CreateCategories(categories: SetupCategoriesInput) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const parsedData = SetupCategoriesSchema.safeParse(categories);

  if (!parsedData.success) {
    throw parsedData.error;
  }

  // create all categories in a single transaction
  const result = await prisma.$transaction(async (tx) => {
    // Delete existing categories for this user
    await tx.category.deleteMany({
      where: {
        userId: user.id,
      },
    });

    const allCategories = [
      ...parsedData.data.incomeCategories,
      ...parsedData.data.expenseCategories,
    ];

    return await Promise.all(
      allCategories.map((category) =>
        tx.category.create({
          data: {
            name: category.name,
            userId: user.id,
            type: category.type,
            icon: category.icon,
          },
        }),
      ),
    );
  });

  return result;
}
