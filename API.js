import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/recipe", async (req, res) => {
  try {
    const ingredients = req.body.ingredients;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Jij bent een chefkok die creatieve recepten bedenkt." },
        { role: "user", content: `Maak een lekker recept met deze ingrediënten: ${ingredients}` }
      ],
      max_tokens: 400
    });

    res.json({ recipe: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server draait op http://localhost:3000"));
