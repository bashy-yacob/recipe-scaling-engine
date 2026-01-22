import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key is missing' }, { status: 500 });
    }

    const groq = new Groq({ apiKey });

    const prompt = `
You are an expert recipe parser. Parse the following recipe text into a structured JSON format suitable for a recipe scaling application.
The text is likely in Hebrew.

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks, just pure JSON.

Output structure:
{
  "title": "Recipe Title",
  "description": "Short description if available",
  "servings": number (default 4 if not specified),
  "prepTime": number (in minutes, estimate if not specified but mentioned),
  "cookTime": number (in minutes),
  "ingredients": [
    {
      "name": "Ingredient Name (in Hebrew)",
      "amount": number (or null if not specified/free text),
      "unit": "Unit" (e.g., "גרם", "כפית", "כף", "כוס", "מ״ל" or "יחידות" if it's a count),
      "scalingRule": "linear" | "logarithmic" | "sqrt" | "fixed" (default "linear")
    }
  ],
  "instructions": ["Step 1", "Step 2", ...]
}

Scaling Rules Guide (Apply smart logic):
- linear: Most ingredients (flour, sugar, water, milk, eggs, meat, vegetables)
- logarithmic: Yeast (dry/fresh), baking powder, baking soda, hot spices (chili, pepper), strong extracts
- sqrt: Salt, sugar (in savory dishes), garlic, some spices
- fixed: Items that don't scale well or are for garnish/coating (e.g. oil for frying, egg for coating, parsley for garnish)

Instructions:
- Split instructions into logical steps.
- Keep the language in Hebrew.

Text to parse:
${text}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a helpful assistant that parses recipes into JSON. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    let content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from Groq');
    }

    // Clean up the response - remove markdown code blocks if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsedData = JSON.parse(content);
    
    return NextResponse.json({ success: true, data: parsedData });

  } catch (error) {
    console.error('Error parsing recipe:', error);
    return NextResponse.json({ error: 'Failed to parse recipe' }, { status: 500 });
  }
}
