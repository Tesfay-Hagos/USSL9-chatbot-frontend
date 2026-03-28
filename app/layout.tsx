import type { Metadata } from "next";
import "./globals.css";
import ErrorOverlaySuppressor from "@/components/ErrorOverlaySuppressor";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Assistente ULSS 9 Scaligera – Ricerca informazioni sul sito",
  description: "Assistente AI per l'Azienda ULSS 9 Scaligera. Scrivi la tua domanda per trovare informazioni su orari, sedi, servizi e documenti.",
};

// Inline script runs before paint — prevents flash of wrong theme
const themeScript = `(function(){try{var t=localStorage.getItem('ulss9-chat-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}else if(window.matchMedia('(prefers-color-scheme: light)').matches){document.documentElement.setAttribute('data-theme','light');}else{document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ErrorOverlaySuppressor />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
