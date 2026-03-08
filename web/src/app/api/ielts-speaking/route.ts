import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    const question = (formData.get('question') as string) || '';
    const part = (formData.get('part') as string) || 'part1';

    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'Speech transcription not configured' }, { status: 503 });
    }

    // ── Step 1: Transcribe with OpenAI Whisper ───────────────────────────────
    const whisperForm = new FormData();
    whisperForm.append('file', audioFile, 'recording.webm');
    whisperForm.append('model', 'whisper-1');
    whisperForm.append('language', 'en');

    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: whisperForm,
    });

    if (!whisperRes.ok) {
      const err = await whisperRes.text();
      console.error('Whisper error:', err);
      throw new Error(`Transcription failed (${whisperRes.status})`);
    }

    const { text: transcription } = await whisperRes.json();

    if (!transcription?.trim()) {
      return NextResponse.json({ success: false, error: 'Could not transcribe audio' }, { status: 400 });
    }

    // ── Step 2: Evaluate with Groq ───────────────────────────────────────────
    if (!GROQ_API_KEY) {
      const wordCount = transcription.split(/\s+/).filter(Boolean).length;
      return NextResponse.json({
        success: true,
        assessment: {
          scores: { overall: 0, fluency: 0, vocabulary: 0, coherence: 0, pronunciation: 0 },
          transcription,
          wordCount,
          speakingTime: 0,
          pauseCount: 0,
          strengths: [],
          weaknesses: ['Evaluation service unavailable'],
          suggestions: [],
        },
      });
    }

    const partLabel =
      part === 'part1' ? 'Part 1 (short answers)' :
      part === 'part2' ? 'Part 2 (2-minute monologue)' :
      'Part 3 (discussion)';

    const wordCount = transcription.split(/\s+/).filter(Boolean).length;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content:
              'You are a certified IELTS examiner specialising in the Speaking test. ' +
              'Evaluate on four criteria: Fluency & Coherence, Lexical Resource, ' +
              'Grammatical Range & Accuracy, and Pronunciation. ' +
              'Return ONLY valid JSON — no markdown, no code fences.',
          },
          {
            role: 'user',
            content:
              `IELTS Speaking ${partLabel}\n` +
              `Question: ${question || 'General speaking question'}\n` +
              `Candidate response: "${transcription}"\n` +
              `Word count: ${wordCount}\n\n` +
              `Return this exact JSON:\n` +
              `{"overall_band":<0-9>,"band_scores":{"fluency_coherence":<0-9>,"lexical_resource":<0-9>,"grammatical_range":<0-9>,"pronunciation":<0-9>},"strengths":[...],"improvements":[...],"suggestions":"<tip>"}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 600,
      }),
    });

    if (!groqRes.ok) throw new Error(`Groq error: ${groqRes.status}`);

    const groqData = await groqRes.json();
    const rawText = groqData.choices?.[0]?.message?.content?.trim() ?? '';

    let ev: any = {};
    try {
      const match = rawText.match(/\{[\s\S]*\}/);
      ev = JSON.parse(match ? match[0] : rawText);
    } catch {
      ev = { overall_band: 5.5, band_scores: {}, strengths: [], improvements: [], suggestions: '' };
    }

    const bs = ev.band_scores || {};
    const overall = ev.overall_band ?? 5.5;

    return NextResponse.json({
      success: true,
      assessment: {
        scores: {
          overall,
          fluency: bs.fluency_coherence ?? overall,
          vocabulary: bs.lexical_resource ?? overall,
          coherence: bs.grammatical_range ?? overall,
          pronunciation: bs.pronunciation ?? overall,
        },
        transcription,
        wordCount,
        speakingTime: 0,
        pauseCount: 0,
        strengths: Array.isArray(ev.strengths) ? ev.strengths : [],
        weaknesses: Array.isArray(ev.improvements) ? ev.improvements : [],
        suggestions: ev.suggestions ? [ev.suggestions] : [],
      },
    });
  } catch (error: any) {
    console.error('IELTS Speaking API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to evaluate speaking response' },
      { status: 500 }
    );
  }
}
