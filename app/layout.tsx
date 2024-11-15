import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import RootProvider from "@/components/providers/RootProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Pouparia.com",
  description: "Seu gerenciador de gastos pessoais",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-br">
        <body className={`antialiased light bg-neutral-50 `}>
          <Toaster richColors position="bottom-right" />
          <RootProvider>{children}</RootProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
