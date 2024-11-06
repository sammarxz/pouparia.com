"use server";

import { currentUser } from "@clerk/nextjs/server";

import { CategorySchema, CreateCategorySchema } from "@/schema/categories";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { TransactionType } from "@/types/transaction";

export async function CreateCategory(form: CreateCategorySchema) {
  const parsedBody = CategorySchema.safeParse(form);
  if (!parsedBody.success) throw new Error("bad request");

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { name, icon, type } = form;

  return await prisma.category.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  });
}

export interface UpdateCategoryParams {
  currentName: string;
  name: string;
  icon: string;
  type: "income" | "expense";
}

export async function UpdateCategory({ currentName, ...data }: UpdateCategoryParams) {
  const parsedBody = CategorySchema.safeParse(data);
  if (!parsedBody.success) throw new Error("bad request");

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return await prisma.category.update({
    where: {
      name_userId_type: {
        name: currentName,
        userId: user.id,
        type: data.type,
      },
    },
    data: {
      name: data.name,
      icon: data.icon,
      type: data.type,
    },
  });
}

export async function DeleteCategory(params: { name: string; type: TransactionType }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return await prisma.category.delete({
    where: {
      name_userId_type: {
        name: params.name,
        userId: user.id,
        type: params.type,
      },
    },
  });
}