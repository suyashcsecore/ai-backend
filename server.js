// server.js
import express from "express";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const app = express();

// Middleware
app.use(cors()); // Allow requests from any origin (for testing)
app.use(express.json());

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test route
app.get("/", (req, res) => {
  res.send("🤖 Chatbot backend is running!");
});

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Message is required" });

    console.log("Message received from frontend:", message);

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    });

    const reply = gptResponse.choices[0].message.content;
    console.log("Reply sent to frontend:", reply);

    res.json({ reply });
  } catch (error) {
    console.error("Error in /chat route:", error);
    res.status(500).json({ reply: "Sorry, something went wrong with GPT!" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
