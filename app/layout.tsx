import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/providers/providers";
import { AxiosProvider } from "@/providers/axiosProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Training Center Management",
  description: "Training Center Management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className={inter.className}>
          <Providers>
            <AxiosProvider>
              {children}
              <Toaster />
            </AxiosProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
