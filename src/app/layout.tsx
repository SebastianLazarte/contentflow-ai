import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const themeInitScript = `
  (function () {
    try {
      var storedTheme = localStorage.getItem("theme");
      var systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var theme = storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : (systemPrefersDark ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", theme);
    } catch (error) {
      document.documentElement.setAttribute("data-theme", "light");
    }
  })();
`;

export const metadata: Metadata = {
  title: "ContentFlow AI",
  description: "Genera documentacion de producto facilmente con IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="app-shell">
          <header className="app-header">
            <a href="/prd" className="app-brand">ContentFlow AI</a>
            <ThemeToggle />
          </header>
          <div className="app-content">{children}</div>
        </div>
      </body>
    </html>
  );
}
