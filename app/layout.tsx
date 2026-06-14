import type { Metadata } from "next";
import "./globals.css";
import { Sora } from "next/font/google";
import { Toaster } from "sonner";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme-provider";

const sora = Sora({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "DevPulse - Code Meets Craft",
  description: "A neon social showcase for developers to launch projects, gather feedback, and climb leaderboards.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=JetBrains+Mono:wght@500&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        </head>
        <body className={`${sora.className} min-h-screen flex flex-col`}>
          
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            {/* {Navbar} */}
            <Navbar/>
            {
            /* {Main Section} */}
            <main className="flex-1">{children}</main>

            {/* {Footer} */}
            <Footer />

            <Toaster richColors/>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
    
  );
}
