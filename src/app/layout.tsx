import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as requested (Modern)
import "./globals.css";
import Header from "@/components/Header";
import MonetagScript from "@/components/MonetagScript"; // Loads only if env provided

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AGTALIST",
  description: "Modern Content Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <MonetagScript />
        {/* Check if we are in admin to hide header? 
            Actually, Admin layout is separate, but RootLayout wraps EVERYTHING including Admin Layout.
            We might want to conditionally render Header only if NOT in admin.
            But we are in Server Component here, we can't easily check pathname without headers().
            However, AdminLayout has its own Sidebar structure. Detailed headers might conflict.
            Let's keep Global Header for public pages only.
            We can make Header client-side check pathname and return null if starts with /admin.
        */}
        <HeaderWrapper />
        {children}
      </body>
    </html>
  );
}

// Separate component to handle conditional rendering logic
import HeaderWrapper from "@/components/HeaderWrapper";
