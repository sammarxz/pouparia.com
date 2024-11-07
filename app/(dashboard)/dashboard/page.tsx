import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

// import { Overview } from "@/components/dashboard/Overview";
// import { History } from "@/components/history/History";
import { MobileDashboard } from "@/components/mobile/MobileDashboard";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect("/wizard");
  }

  return <MobileDashboard userSettings={userSettings} />;
}
