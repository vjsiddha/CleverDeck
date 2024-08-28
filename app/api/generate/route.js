import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = (count) => `
You are an AI that generates ${count} flashcards in JSON format.
Each flashcard should have one question on the front and a brief answer on the back.
Return only the JSON object: {"flashcards": [{"front": "Question?", "back": "Answer"}]}.
`;

const reviewPrompt = `
You are an AI that generates a very thorough topic review that ensures the user gains a good understanding of the topic and practice question sheet in plain text format.
First, provide a detailed topic review. Then, include multiple practical questions each of varying difficulty such that they test the user's application and knowledge of the topic.
Avoid direct repetition of flashcard questions and answers.
Return the content as plain text with sections clearly marked as 'Topic Review:' and 'Practice Questions:'.
`;

const generateTest = async (flashcards, reviewSheet) => {
  const minimumQuestions = 9; // Minimum number of questions required
  const testPrompt = `
    You are an AI that generates a challenging test from a set of flashcards and a review sheet.
    The test should challenge the user’s understanding, application, and synthesis of the material. 
    Avoid direct repetition of flashcard questions and answers.
    Instead, create questions that require the user to apply concepts, analyze scenarios, and make inferences.
    The test should contain at least ${minimumQuestions} questions, and more if the content is extensive.
    Return the set of test questions and their answers in JSON format: 
    {"questions": [{"question": "Question?", "answer": "Answer"}]}.
  `;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: testPrompt },
      { role: 'user', content: `Flashcards: ${JSON.stringify(flashcards)}, Review Sheet: ${reviewSheet}` },
    ],
  });

  const response = completion.choices[0].message.content;
  
  try {
    const questions = JSON.parse(response).questions;
    
    if (questions.length < minimumQuestions) {
      throw new Error(`Only ${questions.length} questions generated, which is below the minimum required.`);
    }
    
    return questions;
  } catch (error) {
    console.error("Failed to generate sufficient test questions:", error);
    throw new Error("Failed to generate sufficient test questions");
  }
};

export async function POST(req) {
  const { text, generateReviewSheet, generateTest: shouldGenerateTest, flashcardCount = 10 } = await req.json();

  let flashcards = [];
  let reviewSheet = '';
  let practiceSheet = '';
  let testQuestions = [];

  try {
    // Generate flashcards based on the flashcardCount
    const flashcardCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt(flashcardCount) },
        { role: 'user', content: text },
      ],
    });

    flashcards = JSON.parse(flashcardCompletion.choices[0].message.content).flashcards;

    // Generate review sheet and practice questions if requested
    if (generateReviewSheet) {
      const reviewCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: reviewPrompt },
          { role: 'user', content: text },
        ],
      });

      const responseText = reviewCompletion.choices[0].message.content;
      const reviewStart = responseText.indexOf('Topic Review:');
      const practiceStart = responseText.indexOf('Practice Questions:');

      if (reviewStart !== -1) {
        reviewSheet = responseText.substring(reviewStart, practiceStart !== -1 ? practiceStart : undefined).trim();
      }

      if (practiceStart !== -1) {
        practiceSheet = responseText.substring(practiceStart).trim();
      }
    }

    // Generate test questions if requested
    if (shouldGenerateTest) {
      testQuestions = await generateTest(flashcards, reviewSheet);

      if (!testQuestions || testQuestions.length === 0) {
        throw new Error("No test questions generated");
      }
    }

    return NextResponse.json({ flashcards, reviewSheet, practiceSheet, testQuestions });

  } catch (error) {
    console.error('Error processing request:', error.message);
    return NextResponse.json({ error: 'Failed to process the request', details: error.message }, { status: 500 });
  }
}
