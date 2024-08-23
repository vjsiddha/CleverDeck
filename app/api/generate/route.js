import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use the new OpenAI API key
});

const systemPrompt = `
You are an AI that generates 10 flashcards in JSON format.
Each flashcard should have one question on the front and a brief answer on the back.
Return only the JSON object: {"flashcards": [{"front": "Question?", "back": "Answer"}]}.
`;

export async function POST(req) {
  const data = await req.text();

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo', // Use GPT-3.5 model
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: data },
    ],
  });

  console.log('API Response:', completion); // Log the response for debugging

  let flashcards;
  try {
    flashcards = JSON.parse(completion.choices[0].message.content);
    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error('Error parsing response:', completion.choices[0].message.content); // Log parsing error
    return NextResponse.json({ error: 'Failed to parse response', details: completion.choices[0].message.content }, { status: 500 });
  }
}
