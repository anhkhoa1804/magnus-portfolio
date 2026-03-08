import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const PARTS = ['Part 2', 'Part 3'];
const SEED_TOPICS = [
  'technology', 'environment', 'education', 'travel', 'culture', 'health',
  'work', 'family', 'cities', 'food', 'sports', 'media', 'arts', 'language',
];

export async function GET() {
  const part = PARTS[Math.floor(Math.random() * PARTS.length)];
  const topic = SEED_TOPICS[Math.floor(Math.random() * SEED_TOPICS.length)];

  const systemPrompt =
    'You are an IELTS speaking examiner. Generate ONE realistic IELTS speaking question. ' +
    'Respond ONLY with valid JSON, no markdown, no extra text.';

  const userPrompt =
    part === 'Part 2'
      ? `Generate a Part 2 IELTS speaking question about the theme "${topic}". ` +
        'Format: {"part":"Part 2","topic":"Describe ...","prompts":["point 1","point 2","point 3","point 4"],"time":120}'
      : `Generate a Part 3 IELTS speaking question about the theme "${topic}". ` +
        'Format: {"part":"Part 3","topic":"A discussion question...","prompts":["Consider...","Think about..."],"time":90}';

  if (!GROQ_API_KEY) {
    // Fallback if no Groq key
    return NextResponse.json({
      part: 'Part 2',
      topic: 'Describe a person who has had an important influence on your life',
      prompts: ['Who this person is', 'How you met them', 'What influence they had', 'Why they are important to you'],
      time: 120,
    });
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 300,
        temperature: 0.9,
      }),
    });

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim() ?? '';
    const question = JSON.parse(text);

    return NextResponse.json(question);
  } catch {
    return NextResponse.json({
      part: 'Part 2',
      topic: 'Describe a memorable journey you have made',
      prompts: ['Where you went', 'How you traveled', 'Why you made this journey', 'What made it memorable'],
      time: 120,
    });
  }
}
