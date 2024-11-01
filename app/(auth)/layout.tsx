import type { ReactNode } from "react";

import { Logo } from "@/components/Logo";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center">
      <Logo />
      <div className="mt-12">{children}</div>
    </div>
  );
}
