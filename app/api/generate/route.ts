import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { faq, tone, question } = await req.json();

  const prompt = `
You are a helpful customer service rep. Use the following FAQs to answer the customer’s question in a ${tone} tone.

FAQs:
${faq}

Question:
${question}

Answer:
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo", // or "gpt-4" if your key supports it
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  const reply = data?.choices?.[0]?.message?.content ?? JSON.stringify(data, null, 2);


  return NextResponse.json({ reply });
}

