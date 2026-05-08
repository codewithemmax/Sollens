"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ScoreCard from "@/components/ScoreCard";
import ScoreBreakdown from "@/components/ScoreBreakdown";
import MintButton from "@/components/MintButton";
import { requestScore, getScore, getTaskStatus } from "@/lib/helius";

export default function Dashboard() {
  const { publicKey, signMessage } = useWallet();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scoreData, setScoreData] = useState<any>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey) {
      router.push("/");
    }
  }, [publicKey, router]);

  const handleRequestScore = async () => {
    if (!publicKey || !signMessage) return;

    setLoading(true);
    try {
      // Sign message for authentication
      const message = `Request SolScore for ${publicKey.toString()}`;
      const signature = await signMessage(new TextEncoder().encode(message));
      
      const result = await requestScore(
        publicKey.toString(),
        Buffer.from(signature).toString("hex"),
        message
      );

      if (result.status === "completed") {
        setScoreData(result.data);
      } else {
        setTaskId(result.task_id);
        pollTaskStatus(result.task_id);
      }
    } catch (error) {
      console.error("Failed to request score:", error);
    } finally {
      setLoading(false);
    }
  };

  const pollTaskStatus = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const result = await getTaskStatus(id);
        if (result.status === "completed") {
          setScoreData(result.data);
          setTaskId(null);
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Failed to poll task:", error);
        clearInterval(interval);
      }
    }, 3000);
  };

  if (!publicKey) return null;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Your Dashboard</h1>
        
        {!scoreData && !loading && !taskId && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-xl mb-6">Ready to calculate your SolScore?</p>
            <button
              onClick={handleRequestScore}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg"
            >
              Calculate My Score
            </button>
          </div>
        )}

        {(loading || taskId) && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-xl">Analyzing your wallet history...</p>
            <p className="text-gray-600 mt-2">This may take a few moments</p>
          </div>
        )}

        {scoreData && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <ScoreCard score={scoreData.score} grade={scoreData.grade} />
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4">Next Steps</h3>
                <p className="text-gray-600 mb-6">
                  Mint your score as a Soulbound NFT to prove your creditworthiness to lenders.
                </p>
                <MintButton
                  score={scoreData.score}
                  breakdown={scoreData.breakdown}
                  onMinted={() => console.log("NFT minted!")}
                />
              </div>
            </div>
            
            <ScoreBreakdown breakdown={scoreData.breakdown} />
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4">Improvement Tips</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Repay loans on time to boost your repayment history</li>
                <li>✓ Engage with more DeFi protocols (Raydium, Orca, Jupiter)</li>
                <li>✓ Hold a diverse portfolio of tokens</li>
                <li>✓ Participate in DAO governance on Realms</li>
                <li>✓ Keep your wallet active over time</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
