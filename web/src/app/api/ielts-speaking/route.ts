import { NextRequest, NextResponse } from 'next/server';

const _rawBackendUrl = process.env.AI_BACKEND_URL;
const AI_BACKEND_URL = !_rawBackendUrl
  ? 'https://anhkhoa1804-magnus-ai-backend.hf.space'
  : _rawBackendUrl;

export async function POST(req: NextRequest) {
  try {
    if (!AI_BACKEND_URL) {
      return NextResponse.json({ success: false, error: 'AI backend not configured' }, { status: 500 });
    }

    const contentType = req.headers.get('content-type') || '';
    let backendResponse: Response;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      backendResponse = await fetch(`${AI_BACKEND_URL}/api/ielts-speaking`, {
        method: 'POST',
        body: formData,
      });
    } else {
      const body = await req.json();
      backendResponse = await fetch(`${AI_BACKEND_URL}/api/ielts-speaking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }

    const raw = await backendResponse.text();
    let data: any = {};
    try {
      data = JSON.parse(raw);
    } catch {
      data = { success: false, error: raw || `AI backend error: ${backendResponse.status}` };
    }

    if (!backendResponse.ok || data?.success === false) {
      return NextResponse.json(
        { success: false, error: data?.error || `AI backend error: ${backendResponse.status}` },
        { status: backendResponse.status || 500 }
      );
    }

    const transcript = String(data?.transcript || '').trim();
    const wordCount = transcript ? transcript.split(/\s+/).filter(Boolean).length : 0;
    const evaluation = data?.evaluation || {};
    const scores = data?.scores || evaluation?.band_scores || {};
    const overall = Number(data?.overall_band ?? evaluation?.overall_band ?? 0);

    return NextResponse.json({
      success: true,
      assessment: {
        scores: {
          overall,
          fluency: Number(scores?.fluency_coherence ?? overall),
          vocabulary: Number(scores?.lexical_resource ?? overall),
          coherence: Number(scores?.grammar_accuracy ?? scores?.grammatical_range ?? overall),
          pronunciation: Number(scores?.pronunciation ?? overall),
        },
        transcription: transcript,
        wordCount,
        speakingTime: 0,
        pauseCount: 0,
        strengths: Array.isArray(evaluation?.strengths) ? evaluation.strengths : [],
        weaknesses: Array.isArray(evaluation?.improvements) ? evaluation.improvements : [],
        suggestions: Array.isArray(evaluation?.suggestions)
          ? evaluation.suggestions
          : evaluation?.suggestions
          ? [evaluation.suggestions]
          : [],
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
