'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Pitch, PitchType, Slide, TextElement } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface GeneratePitchInput {
    pitchType: PitchType;
    pitchTitle: string;
    audience: string;
    goal: string;
    location?: string;
    highlights: string[];
    notes?: string;
}

export async function generatePitchAction(input: GeneratePitchInput): Promise<Pitch> {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
# GOD-LEVEL PROMPT: AI-Powered Pitch Deck Content Generation Engine

## 1. SYSTEM GOAL
Transform user inputs into a clear, logical, investor-ready pitch deck structure with slide-by-slide content, strong narrative flow, and image suggestions.

## 2. STRICT MODEL CONSTRAINTS
- Use ONLY provided data.
- Mark missing info as ASSUMPTION or PLACEHOLDER.
- Do NOT fabricate market numbers.

## 3. INPUT DATA
- **Pitch Type**: ${input.pitchType}
- **Title/Project**: ${input.pitchTitle}
- **Target Audience**: ${input.audience}
- **Goal**: ${input.goal}
- **Highlights/Context**: 
${input.highlights.map(h => `- ${h}`).join('\n')}
${input.notes ? `- Additional Notes: ${input.notes}` : ''}
${input.location ? `- Location: ${input.location}` : ''}

## 4. YOUR CORE RESPONSIBILITY
Generate a complete pitch deck content blueprint. Define what each slide should say and why.

## 5. REQUIRED OUTPUT JSON STRUCTURE
You must return a JSON object holding a specific array of slides. 
Format:
{
  "slides": [
    {
      "title": "Slide Title",
      "bullets": ["Point 1", "Point 2", "Point 3"],
      "speakerNotes": "Context for the presenter..."
    }
  ]
}

## 6. STRUCTURE GUIDELINES
Include these slides where relevant (adjust for ${input.pitchType}):
1. Title / Vision
2. Problem / Context
3. Solution / Value Prop
4. Market / Opportunity
5. Business Model / Strategy
6. Traction / Validation
7. Competition
8. Team
9. Financials / Ask

## 7. TONE
Clear, confident, calm, intelligent. No marketing fluff.

GENERATE ONLY JSON. NO MARKDOWN.
`;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean markdown fencing if present
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(cleanedText) as { slides: { title: string, bullets: string[], speakerNotes?: string }[] };

        // Map to internal Pitch structure
        const slides: Slide[] = data.slides.map(s => {
            const htmlContent = `<ul>${s.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`;

            const textElement: TextElement = {
                id: crypto.randomUUID(),
                type: 'text-list',
                x: 50,
                y: 100,
                w: 600,
                h: 400,
                zIndex: 1,
                html: htmlContent,
            };

            return {
                id: crypto.randomUUID(),
                title: s.title,
                elements: [textElement],
                speakerNotes: s.speakerNotes || '',
                bullets: s.bullets
            };
        });

        return {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            ...input,
            slides,
        };

    } catch (error) {
        console.error('AI Generation Error:', error);
        throw new Error('Failed to generate pitch content');
    }
}
