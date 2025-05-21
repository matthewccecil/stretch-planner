export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { notes } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "user", content: notes }
        ],
        temperature: 0.7,
        max_tokens: 5000 // 🔥 Ensures room for 52 weeks of content
      })
    });

    const data = await response.json();
    const plan = data?.choices?.[0]?.message?.content || "No response from AI.";
    res.status(200).json({ plan });
  } catch (error) {
    console.error("Error generating plan:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
}
