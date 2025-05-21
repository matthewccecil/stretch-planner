// api/generate-plan.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { sessionType, notes } = req.body;
  const prompt = `You are a certified stretch therapist creating a follow-up plan for a client. Session type: ${sessionType}. Notes from session: ${notes}. Generate a detailed but simple plan they can follow over the next 2 weeks.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const plan = data.choices?.[0]?.message?.content || "No plan generated.";
    res.status(200).json({ plan });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
