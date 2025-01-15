

import { Sidebar } from "@/components/sidebar";
import ChatProvider from "@/context/chat/provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ChatProvider>
                    <div className="w-full h-screen flex flex-row">
                        <Sidebar />
                        {children}
                    </div>
                </ChatProvider>
            </body>
        </html>
    );
}
