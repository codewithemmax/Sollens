const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function requestScore(wallet: string, signature: string, message: string) {
  const response = await fetch(`${API_URL}/api/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet, signature, message }),
  });
  return response.json();
}

export async function getScore(wallet: string) {
  const response = await fetch(`${API_URL}/api/score/${wallet}`);
  if (!response.ok) throw new Error("Score not found");
  return response.json();
}

export async function getTaskStatus(taskId: string) {
  const response = await fetch(`${API_URL}/api/score/task/${taskId}`);
  return response.json();
}
