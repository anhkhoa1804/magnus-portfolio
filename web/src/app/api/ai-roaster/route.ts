import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
    }

    const systemPrompt = `You are a brutally honest, sarcastic AI critic with a sharp wit. Roast photos with humor — playful, not cruel. Mention specific visible details in 2-3 sentences.`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Roast this image! Be specific and funny.' },
              { type: 'image_url', image_url: { url: image } },
            ],
          },
        ],
        max_tokens: 300,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Groq error:', err);
      throw new Error('Groq API call failed');
    }

    const data = await response.json();
    const roastText = data.choices?.[0]?.message?.content || 'No roast generated';

    const lowerRoast = roastText.toLowerCase();
    let sentiment: 'savage' | 'playful' | 'compliment' = 'playful';
    if (lowerRoast.includes('yikes') || lowerRoast.includes('disaster') || lowerRoast.includes('bold choice')) {
      sentiment = 'savage';
    } else if (lowerRoast.includes('not bad') || lowerRoast.includes('impressed') || lowerRoast.includes('actually')) {
      sentiment = 'compliment';
    }

    const commonObjects = ['shirt', 'pants', 'dress', 'shoes', 'hat', 'glasses', 'background', 'lighting', 'pose', 'expression', 'hair', 'outfit'];
    const detectedObjects = commonObjects.filter((obj) => lowerRoast.includes(obj));

    return NextResponse.json({
      roast: roastText,
      detectedObjects: detectedObjects.length > 0 ? detectedObjects : ['overall vibe'],
      sentiment,
    });
  } catch (error) {
    console.error('AI Roaster error:', error);
    return NextResponse.json(
      {
        error: 'Failed to roast image',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
