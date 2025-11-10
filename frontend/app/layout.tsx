"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { WalletProvider } from "@/contexts/wallet-context";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { WelcomeDialog } from "@/components/welcome-dialog";
import { HelpButton } from "@/components/help-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 overflow-auto">
              <div className="border-b">
                <div className="flex h-16 items-center px-4 gap-4">
                  <SidebarTrigger />
                  <div className="ml-auto flex items-center gap-2">
                    <ConnectWalletButton />
                  </div>
                </div>
              </div>
              {children}
            </main>
          </SidebarProvider>
          <WelcomeDialog />
          <HelpButton />
          <Toaster />
        </WalletProvider>
      </body>
    </html>
  );
}
