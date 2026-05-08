"use client";

import { useState } from "react";
import { getScore } from "@/lib/helius";
import ScoreCard from "@/components/ScoreCard";
import ScoreBreakdown from "@/components/ScoreBreakdown";

export default function LenderPortal() {
  const [walletAddress, setWalletAddress] = useState("");
  const [scoreData, setScoreData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleQuery = async () => {
    if (!walletAddress) return;

    setLoading(true);
    setError("");
    setScoreData(null);

    try {
      const data = await getScore(walletAddress);
      setScoreData(data);
    } catch (err) {
      setError("Score not found for this wallet. User may not have generated a score yet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Lender Portal</h1>
        <p className="text-gray-600 mb-8">
          Query any wallet address to view their SolScore and assess creditworthiness
        </p>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <label className="block text-sm font-medium mb-2">Wallet Address</label>
          <div className="flex gap-4">
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter Solana wallet address..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              onClick={handleQuery}
              disabled={loading || !walletAddress}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-8 rounded-lg disabled:opacity-50"
            >
              {loading ? "Querying..." : "Query Score"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {scoreData && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <ScoreCard score={scoreData.score} grade={scoreData.grade} />
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4">Lending Recommendation</h3>
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold">Risk Level: </span>
                    <span className={
                      scoreData.grade === "A" ? "text-green-600" :
                      scoreData.grade === "B" ? "text-blue-600" :
                      scoreData.grade === "C" ? "text-yellow-600" :
                      scoreData.grade === "D" ? "text-orange-600" :
                      "text-red-600"
                    }>
                      {scoreData.grade === "A" || scoreData.grade === "B" ? "Low" :
                       scoreData.grade === "C" ? "Medium" : "High"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Suggested LTV: </span>
                    <span>
                      {scoreData.grade === "A" ? "Up to 80%" :
                       scoreData.grade === "B" ? "Up to 60%" :
                       scoreData.grade === "C" ? "Up to 40%" :
                       scoreData.grade === "D" ? "Up to 20%" :
                       "Collateralized only"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Last Updated: </span>
                    <span>{new Date(scoreData.last_updated * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <ScoreBreakdown breakdown={scoreData.breakdown} />
          </div>
        )}
      </div>
    </main>
  );
}
