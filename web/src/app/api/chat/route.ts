import { NextRequest, NextResponse } from 'next/server';
import { searchKnowledge } from '@/data/knowledgeBase';

const AI_BACKEND_URL = process.env.AI_BACKEND_URL;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function callGroq(messages: { role: string; content: string }[]) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages, max_tokens: 512 }),
  });
  if (!res.ok) throw new Error(`Groq error: ${res.status}`);
  const data = await res.json();
  return { answer: data.choices?.[0]?.message?.content ?? '', success: true };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, conversation_history } = body;

    if (!query) {
      return NextResponse.json({ success: false, error: 'Query is required' }, { status: 400 });
    }

    // RAG: Search knowledge base for relevant context
    const relevantContext = searchKnowledge(query);
    let augmentedQuery = query;
    if (relevantContext.length > 0) {
      const contextText = relevantContext.join('\n\n');
      augmentedQuery = `Context about Anh Khoa (Magnus):
${contextText}

User question: ${query}

Please answer the user's question using the provided context. If the question is about Anh Khoa, his projects, skills, or interests, use the context above. If the question is general or outside the context, answer normally.`;
    }

    // Try HuggingFace Space backend first
    if (AI_BACKEND_URL) {
      try {
        const response = await fetch(`${AI_BACKEND_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: augmentedQuery, conversation_history: conversation_history || [] }),
        });
        if (response.ok) {
          const data = await response.json();
          return NextResponse.json(data);
        }
      } catch {
        // Backend unavailable — fall through to Groq
      }
    }

    // Fallback: Groq
    if (!GROQ_API_KEY) {
      return NextResponse.json({ success: false, error: 'AI backend unavailable' }, { status: 503 });
    }
    const history = (conversation_history || []).map((m: any) => ({ role: m.role as string, content: m.content as string }));
    const result = await callGroq([...history, { role: 'user', content: augmentedQuery }]);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
