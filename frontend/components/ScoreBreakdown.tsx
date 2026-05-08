"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ScoreBreakdownProps {
  breakdown: {
    repayment_history: number;
    defi_activity: number;
    wallet_age: number;
    token_diversity: number;
    dao_participation: number;
  };
}

export default function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  const data = [
    { name: "Repayment", score: breakdown.repayment_history, max: 340 },
    { name: "DeFi Activity", score: breakdown.defi_activity, max: 170 },
    { name: "Wallet Age", score: breakdown.wallet_age, max: 128 },
    { name: "Token Diversity", score: breakdown.token_diversity, max: 85 },
    { name: "DAO Participation", score: breakdown.dao_participation, max: 128 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-xl font-bold mb-4">Score Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="score" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2 text-sm">
        {data.map((item) => (
          <div key={item.name} className="flex justify-between">
            <span>{item.name}:</span>
            <span className="font-semibold">{item.score} / {item.max}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
