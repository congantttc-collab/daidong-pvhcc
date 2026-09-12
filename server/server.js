import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "./prompt.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json({ limit: "2mb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.json({
    status: "AI 7.0 PRO READY",
    port: process.env.PORT || 3000
  });
});

app.post("/chat", async (req, res) => {
  try {
    const messages = req.body.messages || [];

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ]
    });

    res.json({
      ok: true,
      reply: completion.choices[0].message.content
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      ok: false,
      reply: "Xin lỗi, AI đang tạm thời gặp sự cố."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("==============================");
  console.log(" AI 7.0 PRO SERVER READY");
  console.log(" PORT:", PORT);
  console.log("==============================");
});