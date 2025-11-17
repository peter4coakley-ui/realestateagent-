import { NextRequest, NextResponse } from 'next/server';
import { nanoBanana } from '@/lib/nanoBanana';

export const maxDuration = 30; // Vision analysis timeout

interface AnalyzeRequestBody {
  imageUrl: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequestBody = await request.json();

    if (!body.imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing imageUrl' },
        { status: 400 }
      );
    }

    // Call Nano Banana vision analysis
    const insights = await nanoBanana.analyzeImage(body.imageUrl);

    return NextResponse.json({
      success: true,
      insights,
    });

  } catch (error: any) {
    console.error('Analysis API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to analyze image' 
      },
      { status: 500 }
    );
  }
}
