import { NextRequest, NextResponse } from 'next/server';

const _rawBackendUrl = process.env.AI_BACKEND_URL;
const AI_BACKEND_URL = (!_rawBackendUrl || _rawBackendUrl.startsWith('http://localhost'))
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

    // Parse FormData from frontend
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Call HuggingFace Space backend with base64 image
    const response = await fetch(`${AI_BACKEND_URL}/api/detect-objects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_base64: base64 }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Object Detection Error:', response.status, errorText);
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
    console.error('Object Detection API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to detect objects' 
      },
      { status: 500 }
    );
  }
}
