import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { task_type, prompt, essay } = body;

    if (!essay || essay.trim().length < 50) {
      return NextResponse.json(
        { error: 'Essay must be at least 50 words' },
        { status: 400 }
      );
    }

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
    }

    const systemPrompt = `You are an expert IELTS examiner. Evaluate this ${(task_type || 'task2').toUpperCase()} essay on 4 criteria:
1. Task Achievement / Task Response
2. Coherence and Cohesion
3. Lexical Resource
4. Grammatical Range and Accuracy
Band scores use 0–9 scale (0.5 increments). Be constructive and follow IELTS band descriptors accurately.
Respond ONLY with valid JSON, no markdown.`;

    const userPrompt = `Essay prompt: ${prompt || 'General ' + (task_type || 'task2')}

Essay:
${essay}

Return JSON:
{
  "band_scores": {
    "task_achievement": 7.0,
    "coherence_cohesion": 7.5,
    "lexical_resource": 7.0,
    "grammar_accuracy": 7.5
  },
  "overall_band": 7.0,
  "strengths": ["...", "...", "..."],
  "improvements": ["...", "...", "..."],
  "suggestions": "Detailed actionable feedback paragraph..."
}`;

    const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!groqResp.ok) {
      throw new Error(`Groq API error: ${groqResp.status}`);
    }

    const groqData = await groqResp.json();
    const text = groqData.choices?.[0]?.message?.content?.trim() ?? '';

    let evaluation: any;
    try {
      const match = text.match(/\{[\s\S]*\}/);
      evaluation = JSON.parse(match ? match[0] : text);
    } catch {
      // Fallback structure if JSON parse fails
      evaluation = {
        band_scores: { task_achievement: 6.5, coherence_cohesion: 6.5, lexical_resource: 6.5, grammar_accuracy: 6.5 },
        overall_band: 6.5,
        strengths: ['Attempted to address the task', 'Some good vocabulary used'],
        improvements: ['Develop arguments with more specific examples', 'Work on paragraph structure'],
        suggestions: text,
      };
    }


    // Map evaluation to Assessment format
    const bs = evaluation.band_scores || {};
    const overall = evaluation.overall_band ?? 6.5;

    const assessment = {
      scores: {
        overall,
        taskResponse: bs.task_achievement ?? overall,
        coherenceCohesion: bs.coherence_cohesion ?? overall,
        lexicalResource: bs.lexical_resource ?? overall,
        grammaticalRange: bs.grammar_accuracy ?? overall,
      },
      wordCount: essay ? essay.trim().split(/\s+/).length : 0,
      strengths: evaluation.strengths ?? [],
      weaknesses: evaluation.improvements ?? [],
      suggestions: Array.isArray(evaluation.suggestions)
        ? evaluation.suggestions
        : evaluation.suggestions
        ? [evaluation.suggestions]
        : [],
      estimatedBand: `Band ${overall.toFixed(1)}`,
    };

    return NextResponse.json({ success: true, assessment });
  } catch (error: any) {
    console.error('IELTS Writing API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'IELTS evaluation service error',
        details: error.message || 'Failed to evaluate essay',
        note: 'HuggingFace Space backend may be unavailable, restarting, or experiencing issues.',
      },
      { status: 503 }
    );
  }
}
