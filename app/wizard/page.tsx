import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { WizardForm } from "@/components/wizard/WizardForm";
import prisma from "@/lib/prisma";

export default async function WizardPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userCategories = await prisma.category.findMany({
    where: {
      userId: user.id,
    },
  });

  if (userCategories.length > 0 && user.publicMetadata.isWizardCompleted) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center justify-center gap-8">
      <div className="space-y-2">
        <h1 className="text-center text-xl">
          Bem-vindo,{" "}
          <span className="ml-1 font-semibold">{user.firstName}! 👋</span>
        </h1>
        <h2 className="text-center text-base text-muted-foreground">
          Vamos começar com algumas configurações iniciais.
        </h2>
      </div>
      <WizardForm />
      <p className="text-sm text-muted-foreground text-center px-4">
        Não se preocupe! Você poderá alterar todas essas configurações depois
        nas preferências do aplicativo.
      </p>
    </div>
  );
}
