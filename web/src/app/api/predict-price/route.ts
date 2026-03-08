import { NextRequest, NextResponse } from 'next/server';

const AI_BACKEND_URL = process.env.AI_BACKEND_URL;

export async function POST(req: NextRequest) {
  try {
    if (!AI_BACKEND_URL) {
      return NextResponse.json(
        { success: false, error: 'AI backend not configured' },
        { status: 500 }
      );
    }

    const body = await req.json();

    // Call HuggingFace Space backend
    const response = await fetch(`${AI_BACKEND_URL}/api/predict-price`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Price Prediction Error:', response.status, errorText);
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
    console.error('Price Prediction API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to predict price' 
      },
      { status: 500 }
    );
  }
}
