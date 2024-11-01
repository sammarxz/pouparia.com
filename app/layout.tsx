import type { Metadata } from "next";

import "./globals.css";

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
    <html lang="pt-br">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
