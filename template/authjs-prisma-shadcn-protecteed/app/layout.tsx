import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/entities/auth/providers/auth-provider";
import Navbar from "@/shared/components/navbar";
import { Toaster } from "@/shared/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { ClientProvider } from "@/shared/providers/client-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouTube Video Timeline Generator",
  description: "Generate a timeline of topics discussed in YouTube videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ClientProvider>
              <main className="@container mx-auto flex min-h-screen flex-col">
                <Navbar />
                <section className="flex-1">{children}</section>
                <Toaster />
              </main>
            </ClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
