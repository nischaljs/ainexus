

import { Sidebar } from "@/components/sidebar";
import ChatProvider from "@/context/chat/provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FiltersProvider } from "@/context/filter/provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "AI nexus",
    description: "Your hub for all AI needs",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ChatProvider>
                    <FiltersProvider> 
                    <div className="w-full h-screen flex flex-row">
                        <Sidebar />
                        {children}
                    </div>
                    </FiltersProvider>
                </ChatProvider>
            </body>
        </html>
    );
}
