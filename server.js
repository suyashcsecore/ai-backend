import dotenv from "dotenv";
dotenv.config();
console.log("OpenAI Key:", process.env.OPENAI_API_KEY ? "Loaded ✅" : "Missing ❌");
import express from "express";
import OpenAI from "openai";
import cors from "cors";

const app = express();
app.use(cors()); // allow frontend to access backend
app.use(express.json()); // parse JSON request body

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // store your key in environment variables
});

// POST endpoint to handle chat messages
app.post("/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ reply: "Message is required" });
    }

    try {
        // Send the user message to GPT
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini", // you can use "gpt-4o-mini" or "gpt-4o"
            messages: [{ role: "user", content: message }],
        });

        // Return GPT reply to frontend
        res.json({ reply: gptResponse.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: "Sorry, something went wrong with GPT!" });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});