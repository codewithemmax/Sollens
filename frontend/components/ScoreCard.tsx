"use client";

interface ScoreCardProps {
  score: number;
  grade: string;
}

export default function ScoreCard({ score, grade }: ScoreCardProps) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "text-green-500";
      case "B": return "text-blue-500";
      case "C": return "text-yellow-500";
      case "D": return "text-orange-500";
      case "F": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Your SolScore</h2>
      <div className={`text-6xl font-bold mb-2 ${getGradeColor(grade)}`}>
        {score}
      </div>
      <div className={`text-3xl font-semibold ${getGradeColor(grade)}`}>
        Grade {grade}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Range: 300 - 850
      </div>
    </div>
  );
}
