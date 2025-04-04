import "./globals.css";
import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import { Header } from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { WeeksSidebar } from "@/components/sidebar-weeks";
import { SidebarProvider } from "@/components/ui/sidebar";

const exo = Exo_2({
  variable: "--font-exo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Squatter",
  description: "Create and manage your own progession plans with Squatter.",
  icons: {
    icon: "/dumbbell.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${exo.className} antialiased`}>
        <ClerkProvider dynamic>
          <ConvexClientProvider>
            <SidebarProvider defaultOpen={true}>
              <div className="relative flex min-h-screen flex-col w-full">
                <Header />
                <div className="flex flex-1 pt-16">
                  <WeeksSidebar />
                  <main className="flex-1 overflow-auto p-6 w-full ">
                    {children}
                  </main>
                </div>
                <Toaster />
              </div>
            </SidebarProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
