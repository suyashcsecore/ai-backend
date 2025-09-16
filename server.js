import express from "express";
import OpenAI from "openai";
import cors from "cors";

const app = express();
app.use(cors({ origin: "https://suyashcsecore.github.io" }));
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Message is required" });

    try {
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: message }],
        });
        res.json({ reply: gptResponse.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: "Sorry, something went wrong with GPT!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
