import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const TASK_TOPICS = [
  'environment', 'education', 'technology', 'health', 'work', 'society',
  'culture', 'media', 'urbanization', 'travel', 'globalization', 'crime',
  'gender', 'government', 'economics', 'language', 'sport', 'arts',
];

const TASK1_TYPES = [
  'a bar chart', 'a line graph', 'a pie chart', 'a table',
  'a process diagram', 'two maps showing changes over time',
  'a diagram comparing two objects',
];

// Fallback questions per task type
const FALLBACKS: Record<string, { prompt: string; type: string }> = {
  task2: {
    type: 'task2',
    prompt:
      'Some people believe that unpaid community service should be a compulsory part of high school programmes. To what extent do you agree or disagree?',
  },
  task1: {
    type: 'task1',
    prompt:
      'The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
  },
  'task1-general': {
    type: 'task1-general',
    prompt:
      'You recently stayed at a hotel and were unhappy with the service. Write a letter to the hotel manager. In your letter:\n– describe your stay and the problems you experienced\n– explain how you felt about them\n– say what you would like the hotel to do',
  },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const taskType = searchParams.get('type') || 'task2';

  if (!GROQ_API_KEY) {
    return NextResponse.json(FALLBACKS[taskType] || FALLBACKS.task2);
  }

  const topic = TASK_TOPICS[Math.floor(Math.random() * TASK_TOPICS.length)];

  let systemPrompt: string;
  let userPrompt: string;

  if (taskType === 'task2') {
    systemPrompt =
      'You are an IELTS examiner. Generate ONE realistic IELTS Task 2 essay question. ' +
      'Respond ONLY with valid JSON, no markdown.';
    userPrompt =
      `Generate an IELTS Task 2 question about "${topic}". ` +
      'Format: {"type":"task2","prompt":"Full question text here, 2-3 sentences, with a clear instruction like To what extent do you agree or disagree? / Discuss both views and give your own opinion. / What are the causes? What can be done to solve this problem?"}';
  } else if (taskType === 'task1') {
    const chartType = TASK1_TYPES[Math.floor(Math.random() * TASK1_TYPES.length)];
    systemPrompt =
      'You are an IELTS examiner. Generate ONE realistic IELTS Academic Task 1 question describing a chart or diagram. ' +
      'Respond ONLY with valid JSON, no markdown.';
    userPrompt =
      `Generate an IELTS Academic Task 1 question. The visual is ${chartType} about ${topic}. ` +
      'Format: {"type":"task1","prompt":"The [chart type] below shows [description]. Summarise the information by selecting and reporting the main features, and make comparisons where relevant."}';
  } else {
    // task1-general (letter)
    systemPrompt =
      'You are an IELTS examiner. Generate ONE realistic IELTS General Training Task 1 letter-writing question. ' +
      'Respond ONLY with valid JSON, no markdown.';
    userPrompt =
      `Generate an IELTS General Training Task 1 letter question about a situation involving ${topic}. ` +
      'Format: {"type":"task1-general","prompt":"You [situation]. Write a letter to [recipient]. In your letter:\\n– bullet point 1\\n– bullet point 2\\n– bullet point 3"}';
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
        max_tokens: 400,
        temperature: 0.9,
      }),
    });

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim() ?? '';
    const question = JSON.parse(text);
    return NextResponse.json(question);
  } catch {
    return NextResponse.json(FALLBACKS[taskType] || FALLBACKS.task2);
  }
}
