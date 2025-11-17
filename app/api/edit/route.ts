import { NextRequest, NextResponse } from 'next/server';
import { nanoBanana, EditType } from '@/lib/nanoBanana';
import { creditSystem } from '@/lib/creditSystem';

export const maxDuration = 60; // Allow up to 60 seconds for AI processing

interface EditRequestBody {
  imageUrl: string;
  editType: EditType;
  parameters: Record<string, any>;
  maskData?: string;
  brokerageId: string; // For credit tracking
  listingId?: string;
  imageId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: EditRequestBody = await request.json();

    // Validate required fields
    if (!body.imageUrl || !body.editType || !body.brokerageId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: imageUrl, editType, brokerageId' 
        },
        { status: 400 }
      );
    }

    // Validate edit type
    const validEditTypes = ['flooring', 'walls', 'furniture', 'remove', 'masking', 'exterior'];
    if (!validEditTypes.includes(body.editType)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid editType. Must be one of: ${validEditTypes.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Check if brokerage has sufficient credits
    const creditCost = creditSystem.getCreditCost(body.editType);
    const currentBalance = await creditSystem.getBalance(body.brokerageId);

    if (currentBalance < creditCost) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Insufficient credits',
          creditsNeeded: creditCost,
          currentBalance 
        },
        { status: 402 }
      );
    }

    // Call Nano Banana AI to perform the edit
    const result = await nanoBanana.applyEdit({
      imageUrl: body.imageUrl,
      editType: body.editType,
      parameters: body.parameters,
      maskData: body.maskData,
    });

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Edit operation failed' 
        },
        { status: 500 }
      );
    }

    // Deduct credits from brokerage
    const creditDeducted = await creditSystem.deductCredits(
      body.brokerageId,
      result.creditsUsed,
      {
        imageId: body.imageId || '',
        editType: body.editType,
        timestamp: new Date(),
      }
    );

    if (!creditDeducted) {
      console.error('Failed to deduct credits, but edit was successful');
      // Continue anyway - this is a non-critical error
    }

    // Return successful result
    return NextResponse.json({
      success: true,
      resultUrl: result.resultUrl,
      creditsUsed: result.creditsUsed,
      processingTime: result.processingTime,
      remainingCredits: currentBalance - result.creditsUsed,
    });

  } catch (error: any) {
    console.error('Edit API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error during edit operation' 
      },
      { status: 500 }
    );
  }
}

// GET endpoint for checking edit status (if needed for long-running operations)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const editId = searchParams.get('editId');

  if (!editId) {
    return NextResponse.json(
      { success: false, error: 'Missing editId parameter' },
      { status: 400 }
    );
  }

  // TODO: Implement edit status checking for async operations
  return NextResponse.json({
    success: true,
    status: 'completed',
    message: 'Edit status checking not yet implemented',
  });
}
