import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";


export const metadata: Metadata = {
  title: "Sistema de Cadastro de Pessoas e Alunos",
  description: "Aplicativo para gerenciamento de cadastros de pessoas e alunos, com acesso administrativo seguro.",
  manifest: "/manifest.json",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
