'use client'; 


import Image from "next/image";
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export default function DMRepAI() {
  const [faq, setFaq] = useState("");
  const [tone, setTone] = useState("Friendly");
  const [sampleQuestion, setSampleQuestion] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);

  const generateReply = async () => {
    if (!faq || !tone || !sampleQuestion) {
      alert("Please fill out all fields before generating a reply.");
      return;
    }
  
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          faq,
          tone,
          question: sampleQuestion,
        }),
      });
  
      const data = await res.json();
      setGeneratedReply(data.reply);
    } catch (err) {
      console.error("Error generating reply:", err);
      setGeneratedReply("Sorry, something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="w-full max-w-xl px-4 sm:px-6 lg:px-8 py-6 grid gap-6 mx-auto">

<Image
  src="/logo.png"
  alt="SparkReply Logo"
  width={60}
  height={60}
  className="mx-auto mb-4"
/>

<motion.h1 className="text-3xl font-bold text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  SparkReply – Smart Auto-Replies for Your Business
</motion.h1>
      
      <Card className="shadow-xl rounded-2xl">
      <CardContent className="space-y-4 p-4">
  <form
    onSubmit={(e) => {
      e.preventDefault();
      generateReply();
    }}
    className="space-y-4"
  >
    <h2 className="text-xl font-semibold">Train Your Bot</h2>
    <Textarea
  className="w-full"
  placeholder="Paste your FAQs or service info here..."
      rows={4}
      value={faq}
      onChange={(e) => setFaq(e.target.value)}
    />
    <Input
  className="w-full"
  placeholder="Reply tone (e.g., Friendly, Professional"
      value={tone}
      onChange={(e) => setTone(e.target.value)}
    />
    <Input
  className="w-full"
  placeholder="Reply tone (e.g., Friendly, Professional)"
      value={sampleQuestion}
      onChange={(e) => setSampleQuestion(e.target.value)}
    />
    <Button type="submit" disabled={loading} className="w-full sm:w-auto">
      {loading ? "Generating..." : "Generate Reply"}
    </Button>
  </form>

  {generatedReply && (
  <div className="mt-4 bg-gray-100 p-4 rounded-xl text-gray-800">
    <strong>AI Reply:</strong>
    <p className="mt-2">{generatedReply}</p>

    <div className="flex flex-col sm:flex-row gap-2 mt-4">
      <Button
        className="w-full sm:w-auto"
        onClick={() => navigator.clipboard.writeText(generatedReply)}
      >
        Copy to Clipboard
      </Button>

      <Button
        className="w-full sm:w-auto"
        onClick={() => {
          const blob = new Blob([generatedReply], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "reply.txt";
          a.click();
        }}
      >
        Download Reply
      </Button>
    </div>
  </div>
)}

</CardContent>

      </Card>
    </div>
  );
}
