"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { publicKey } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (publicKey) {
      router.push("/dashboard");
    }
  }, [publicKey, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          SolScore
        </h1>
        <p className="text-2xl text-gray-700 mb-8">
          Decentralized On-Chain Credit Scoring for Solana
        </p>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Build your on-chain reputation. Get a credit score (300-850) based on your wallet activity.
          Unlock undercollateralized loans from DeFi protocols.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">Analyze</h3>
            <p className="text-gray-600">We analyze your wallet history across DeFi protocols</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Score</h3>
            <p className="text-gray-600">Get a credit score from 300-850 based on 5 factors</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🎫</div>
            <h3 className="text-xl font-bold mb-2">Mint NFT</h3>
            <p className="text-gray-600">Receive a Soulbound NFT proving your creditworthiness</p>
          </div>
        </div>

        <div className="text-gray-600">
          <p className="mb-4">Connect your wallet to get started</p>
          <p className="text-sm">Supported: Phantom, Backpack, Solflare</p>
        </div>
      </div>
    </main>
  );
}
