import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.20.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function fallbackResponse(pantry: string[], reason: string) {
  console.error("AI fallback used:", reason);

  const recipes = [
    {
      title: "Test Surprise Recipe",
      category: "Test",
      ingredients: [
        "1 slice of bread",
        pantry.length > 0
          ? `1 surprise ingredient from your pantry: ${pantry[0]}`
          : "1 surprise ingredient from your pantry (if any)",
      ],
      steps: [
        "This is a fallback recipe from the Supabase edge function.",
        "If you keep seeing this recipe, OpenAI is not working yet.",
      ],
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      image: "https://placehold.co/600x400?text=Test+Recipe",
    },
  ];

  return jsonResponse({
    source: "fallback",
    reason,
    recipes,
  });
}

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // ----- 1. Read pantry safely -----
  let pantry: string[] = [];
  try {
    const body = await req.json().catch(() => ({} as any));
    pantry = Array.isArray(body.pantry)
      ? body.pantry.map((p: unknown) => String(p).slice(0, 80))
      : [];
  } catch (err) {
    console.error("Error parsing request body:", err);
    return fallbackResponse([], "body-parse-error");
  }

  // ----- 2. Check API key -----
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return fallbackResponse(pantry, "missing-openai-api-key");
  }

  const openai = new OpenAI({ apiKey });

  try {
    // ----- 3. Generate recipes with GPT-4o-mini -----
    const systemPrompt = `
You are an assistant for a cooking website.

Input from the user:
- "pantry": list of ingredient names the user has on hand.

Your task:
- Create between 1 and 3 NEW recipes that the user can cook.
- Each recipe must be a JSON object with:
  - "title": string
  - "category": string such as "Dinner", "Lunch", "Breakfast", "Dessert"
  - "ingredients": array of strings, each including quantity (for example "2 eggs", "200 g flour")
  - "steps": array of strings with clear cooking instructions
  - Optional numbers:
    - "calories"
    - "protein"
    - "carbs"
    - "fat"

Rules:
- Prefer recipes that use many of the pantry ingredients.
- If pantry is empty, create simple everyday recipes.
- All text must be in English.
- Do not mention that you are an AI.
- The recipes should be different each time you are called, even if the pantry is the same. Use creativity and variety.
- Return only valid JSON in this exact shape:
  {
    "recipes": [
      {
        "title": "Example title",
        "category": "Example category",
        "ingredients": ["Example ingredient A", "Example ingredient B"],
        "steps": ["Example step A", "Example step B"],
        "calories": 0,
        "protein": 0,
        "carbs": 0,
        "fat": 0
      }
    ]
  }
No extra keys, no comments, no Markdown.
    `.trim();

    // Add a nonce so the prompt is not identical every time (helps variety)
    const userPayload = { pantry, nonce: Date.now() };

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(userPayload) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.9, // higher temperature for more variety
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let parsed: { recipes?: unknown } = {};
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse OpenAI JSON:", err, raw);
      return fallbackResponse(pantry, "json-parse-error");
    }

    const recipes = Array.isArray((parsed as any).recipes)
      ? (parsed as any).recipes
      : [];

    if (!recipes.length) {
      return fallbackResponse(pantry, "openai-returned-empty");
    }

    // ----- 4. Generate one image for each recipe -----
    const maxImages = Math.min(recipes.length, 3);

    for (let i = 0; i < maxImages; i++) {
      const r = recipes[i] as any;
      const title = String(r.title ?? "Recipe");

      try {
        const img = await openai.images.generate({
          model: "gpt-image-1-mini",
          prompt:
            `High quality food photography of ${title}, plated nicely, ` +
            `top-down shot, soft natural light, no text, no people.`,
          size: "512x512",
          n: 1,
        });

        const url = img.data?.[0]?.url ?? null;
        // If we *still* didn't get a URL, fall back to a placeholder
        r.image =
          url ||
          `https://placehold.co/600x400?text=${encodeURIComponent(title)}`;
      } catch (err) {
        console.error("Image generation failed for recipe:", title, err);
        // Fallback placeholder if image API fails (no image access, etc.)
        (recipes[i] as any).image =
          `https://placehold.co/600x400?text=${encodeURIComponent(title)}`;
      }
    }

    // Any extra recipes just get no image (or you can also give placeholders)
    for (let i = maxImages; i < recipes.length; i++) {
      (recipes[i] as any).image = null;
    }

    return jsonResponse({
      source: "openai",
      reason: null,
      recipes,
    });
  } catch (err) {
    console.error("OpenAI call error:", err);
    return fallbackResponse(pantry, "openai-call-error");
  }
});
