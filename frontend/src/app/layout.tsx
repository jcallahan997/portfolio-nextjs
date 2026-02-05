import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "James Callahan | Portfolio",
  description:
    "Generative AI Engineer — Portfolio showcasing ML, NLP, and generative AI projects.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg">
        {/* Animated gradient mesh background */}
        <div className="gradient-mesh" aria-hidden="true" />

        <Providers>
          <Sidebar />

          {/* Main content area */}
          <main className="md:ml-[260px] relative z-10 min-h-screen">
            <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
