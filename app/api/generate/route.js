import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use the new OpenAI API key
});

const systemPrompt = (count) => `
You are an AI that generates ${count} flashcards in JSON format.
Each flashcard should have one question on the front and a brief answer on the back.
Return only the JSON object: {"flashcards": [{"front": "Question?", "back": "Answer"}]}.
`;

const reviewPrompt = `
You are an AI that generates a very thorough topic review and practice question sheet in plain text format.
First, provide a detailed topic review. Then, include multiple practical questions each of varying difficulty such that they test the user's application and knowledge of the topic.
Return the content as plain text with sections clearly marked as 'Topic Review:' and 'Practice Questions:'.
`;

export async function POST(req) {
  const { text, generateReviewSheet, flashcardCount = 10 } = await req.json();

  let flashcards = [];
  let reviewSheet = '';
  let practiceSheet = '';

  try {
    // Generate review sheet and practice questions if requested
    if (generateReviewSheet) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Use GPT-3.5 model
        messages: [
          { role: 'system', content: reviewPrompt },
          { role: 'user', content: text },
        ],
      });

      const responseText = completion.choices[0].message.content;

      // Parse the response by splitting the text into the review and practice sections
      const reviewStart = responseText.indexOf('Topic Review:');
      const practiceStart = responseText.indexOf('Practice Questions:');

      if (reviewStart !== -1) {
        reviewSheet = responseText.substring(reviewStart, practiceStart !== -1 ? practiceStart : undefined).trim();
      }

      if (practiceStart !== -1) {
        practiceSheet = responseText.substring(practiceStart).trim();
      }
    }

    // Generate flashcards based on the flashcardCount
    const flashcardCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use GPT-3.5 model
      messages: [
        { role: 'system', content: systemPrompt(flashcardCount) },
        { role: 'user', content: text },
      ],
    });

    flashcards = JSON.parse(flashcardCompletion.choices[0].message.content).flashcards;

  } catch (error) {
    console.error('Error parsing response:', error.message);
    return NextResponse.json({ error: 'Failed to process the request', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ flashcards, reviewSheet, practiceSheet });
}
