import type { ReactNode } from "react";

export default function LayoutWizard({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center">
      {children}
    </div>
  );
}
