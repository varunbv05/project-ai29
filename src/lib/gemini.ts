import type { Revision } from "@/components/RevisionResult";

const GEMINI_API_KEY = "AIzaSyDc2dD3Dry8KjO2raDKFVMU-3ci8rfrXqc";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are Recall5 AI, an elite study coach. You produce concise, exam-ready 5-minute revisions.
Be precise, structured, and ruthless about cutting fluff. Use clear academic tone.
When formulas are involved, render them in plain text or LaTeX-friendly notation.

You MUST respond with ONLY a valid JSON object matching this exact structure (no markdown, no code blocks):
{
  "summary": "markdown summary 300-500 words with headings and bullets",
  "key_concepts": [{"term": "string", "definition": "string"}],
  "formulas": [{"name": "string", "expression": "string", "note": "string or empty"}],
  "rapid_fire": [{"q": "string", "a": "string"}],
  "exam_questions": ["string"]
}

Requirements:
- summary: 300-500 words markdown with ## headings and bullet points
- key_concepts: 6-10 items
- formulas: 0 or more (empty array if no formulas)
- rapid_fire: exactly 8-12 Q&A pairs
- exam_questions: exactly 5-7 questions
`;

export interface GenerateInput {
  subject: string;
  chapter: string;
  notes: string;
  imageUrls?: string[];
}

export async function generateRevisionWithGemini(
  input: GenerateInput,
): Promise<Omit<Revision, "id" | "created_at">> {
  const { subject, chapter, notes, imageUrls = [] } = input;

  const textPart = {
    text: `Subject: ${subject}\nChapter: ${chapter}\n\nNotes:\n${notes || "(no text notes provided)"}`,
  };

  // Build parts - text + optional images
  const parts: object[] = [textPart];

  for (const url of imageUrls) {
    // Fetch image and convert to base64
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.readAsDataURL(blob);
      });
      parts.push({
        inlineData: { mimeType: blob.type, data: base64 },
      });
    } catch {
      // skip failed image
    }
  }

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: "user", parts }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("No response from Gemini");

  // Parse JSON — strip any accidental markdown fences
  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);

  return {
    subject,
    chapter,
    summary: parsed.summary ?? "",
    key_concepts: parsed.key_concepts ?? [],
    formulas: parsed.formulas ?? [],
    rapid_fire: parsed.rapid_fire ?? [],
    exam_questions: parsed.exam_questions ?? [],
  };
}
