import { Logo } from "@/components/Logo";
import type { ReactNode } from "react";

export default function LayoutWizard({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex py-12 min-h-screen w-full flex-col items-center justify-center">
      <div className="mb-16">
        <Logo />
      </div>
      {children}
    </div>
  );
}
