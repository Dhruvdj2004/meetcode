const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function solvedoubt(req, res) {
  try {
    const { messages, title, description, testcases, startcode } = req.body;

    const systemPrompt = `You are an expert Data Structures & Algorithms tutor helping a student solve a coding problem on an online judge.

Current problem:
Title: ${title || "Unknown"}
Description: ${description || "Not provided"}
Example test cases: ${JSON.stringify(testcases || [])}
Starter code: ${JSON.stringify(startcode || [])}

Behavior rules:
1. Only help with this problem or general DSA/programming concepts related to it.
2. Give hints and guide the student's thinking before giving a full solution - don't just dump the answer unless they explicitly ask for the complete solution.
3. If asked for code, explain the approach first, then provide clean, correctly-formatted code.
4. Keep responses concise and focused.
5. If the student's question is unrelated to programming/DSA, politely redirect them back to the problem.`;

    const conversation = (messages || []).map((m) => ({
      role: m.role === "model" ? "assistant" : "user",
      content: m.parts?.[0]?.text || ""
    }));

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...conversation
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024
    });

    const text = completion.choices[0].message.content;

    res.status(200).json({
      message: text,
    });

  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ message: "AI Error" });
  }
}

module.exports = { solvedoubt };
