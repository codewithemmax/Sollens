"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

interface MintButtonProps {
  score: number;
  breakdown: any;
  onMinted: () => void;
}

export default function MintButton({ score, breakdown, onMinted }: MintButtonProps) {
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    if (!publicKey || !signTransaction) return;

    setLoading(true);
    try {
      // TODO: Implement actual minting logic with Anchor
      // This would involve:
      // 1. Creating mint account
      // 2. Calling mint_score_nft instruction
      // 3. Uploading metadata to Arweave
      
      console.log("Minting NFT with score:", score);
      
      // Placeholder for actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onMinted();
    } catch (error) {
      console.error("Minting failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMint}
      disabled={loading || !publicKey}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Minting..." : "Mint Soulbound NFT (0.01 SOL)"}
    </button>
  );
}
