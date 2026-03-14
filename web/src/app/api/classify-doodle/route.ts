import { NextRequest, NextResponse } from 'next/server';

const _rawBackendUrl = process.env.AI_BACKEND_URL;
const AI_BACKEND_URL = !_rawBackendUrl
  ? 'https://anhkhoa1804-magnus-ai-backend.hf.space'
  : _rawBackendUrl;

export async function POST(req: NextRequest) {
  try {
    if (!AI_BACKEND_URL) {
      return NextResponse.json(
        { success: false, error: 'AI backend not configured' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { image, top_k = 5 } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image data required' },
        { status: 400 }
      );
    }

    // Call HuggingFace Space backend
    const response = await fetch(`${AI_BACKEND_URL}/api/classify-doodle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_base64: image,
        top_k,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Doodle Classification Error:', response.status, errorText);
      return NextResponse.json(
        { 
          success: false, 
          error: `AI backend error: ${response.status}` 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Doodle Classification API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to classify doodle' 
      },
      { status: 500 }
    );
  }
}
