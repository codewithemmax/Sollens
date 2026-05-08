import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletConnect from "@/components/WalletConnect";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SolScore - Decentralized Credit Scoring",
  description: "On-chain credit scoring system for Solana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletConnect>
          {children}
        </WalletConnect>
      </body>
    </html>
  );
}
