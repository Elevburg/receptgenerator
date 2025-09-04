import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());

// Zorgt dat je index.html gevonden kan worden
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Statische bestanden serveren (zoals index.html, css, js)
app.use(express.static(__dirname));

// Root → laat index.html zien
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Receptgenerator endpoint
app.post("/recipe", async (req, res) => {
  try {
    const ingredients = req.body.ingredients;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Je bent een behulpzame chef-kok." },
        { role: "user", content: `Maak een recept met: ${ingredients}` }
      ],
    });

    res.json({ recipe: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Render geeft standaard een PORT mee
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server draait op poort ${PORT}`));
