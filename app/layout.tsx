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
