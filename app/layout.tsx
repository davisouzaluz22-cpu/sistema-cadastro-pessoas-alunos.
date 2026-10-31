import type { Metadata } from "next"; import "./globals.css";

export const metadata: Metadata = { title: "Sistema de Cadastro de Clientes", description: "Painel administrativo de cadastro de clientes", };

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) { return ( <html lang="pt-BR"> <body>{children}</body> </html> ); }
