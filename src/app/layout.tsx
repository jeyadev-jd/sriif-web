import type { Metadata } from "next";
import { Anton, Figtree, Geist_Mono } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], display: "swap" });
const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400", display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "SRIIF – Sri Ramachandra Innovation Incubation Foundation", template: "%s · SRIIF" },
  description: "Startup incubation at Sri Ramachandra Institute of Higher Education and Research, Chennai: workspace, mentors, labs, hospital access and funding support.",
  icons: { icon: "/img/logo.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${figtree.variable} ${anton.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-brand focus:shadow-lg">Skip to main content</a>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
