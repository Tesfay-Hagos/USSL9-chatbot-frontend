import type { Metadata } from "next";
import "./globals.css";
import ErrorOverlaySuppressor from "@/components/ErrorOverlaySuppressor";

export const metadata: Metadata = {
  title: "Assistente ULSS 9 Scaligera – Ricerca informazioni sul sito",
  description: "Assistente AI per l'Azienda ULSS 9 Scaligera. Scrivi la tua domanda per trovare informazioni su orari, sedi, servizi e documenti.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ErrorOverlaySuppressor />
        {children}
      </body>
    </html>
  );
}
