import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Bandhu Vault",
  description: "An installable PWA for team project updates and media",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning className={`font-sans antialiased bg-neutral-50 text-neutral-900 min-h-screen flex flex-col`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
