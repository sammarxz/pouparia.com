import { Navbar } from "@/components/Navbar";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-4xl mx-auto px-4 pb-8">
      <Navbar />
      <div className="w-full">{children}</div>
    </div>
  );
}
