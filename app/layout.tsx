import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Lapor Bupati – Aceh Barat",
  description: "Sistem Pengaduan Masyarakat Kabupaten Aceh Barat",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.variable}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
