import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  let userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId: user.id,
        currency: "BRL",
      },
    });
  }

  revalidatePath("/");
  return Response.json(userSettings);
}
