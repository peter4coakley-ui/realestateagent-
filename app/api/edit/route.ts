import { NextRequest, NextResponse } from 'next/server';
import { nanoBanana, EditType } from '@/lib/nanoBanana';
import { hasCredits, deductCredits, getCreditCost } from '@/lib/creditSystem';

export const maxDuration = 60; // Allow up to 60 seconds for AI processing

interface EditRequestBody {
  imageUrl: string;
  editType: EditType;
  parameters: Record<string, any>;
  maskData?: string;
  brokerageId: string; // For credit tracking
  listingId?: string;
  imageId?: string;
  userId?: string;
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
    const validEditTypes: EditType[] = ['flooring', 'walls', 'furniture', 'remove', 'masking', 'exterior'];
    if (!validEditTypes.includes(body.editType)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid editType. Must be one of: ${validEditTypes.join(', ')}` 
        },
        { status: 400 }
      );
    }

    const operationType = body.editType;
    const imageId = body.imageId || `img-${Date.now()}`;
    const brokerageId = body.brokerageId;

    // Get credit cost for this operation
    const creditCost = getCreditCost(operationType);

    // Check if brokerage has sufficient credits
    const hasSufficientCredits = await hasCredits(brokerageId, creditCost);

    if (!hasSufficientCredits) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Insufficient credits',
          required: creditCost
        },
        { status: 402 }
      );
    }

    // Deduct credits before processing
    const deductResult = await deductCredits(brokerageId, operationType, {
      imageId,
      listingId: body.listingId,
      userId: body.userId || 'anonymous',
      description: `${operationType} edit on image ${imageId}`,
    });

    if (!deductResult.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to deduct credits' },
        { status: 500 }
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
      // Refund credits if edit failed
      const { addCredits } = await import('@/lib/creditSystem');
      await addCredits(brokerageId, creditCost, 'refund', `Refund for failed ${operationType} edit`);
      
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Edit operation failed' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        resultUrl: result.resultUrl,
        processingTime: result.processingTime,
        creditsUsed: creditCost,
        remainingCredits: deductResult.newBalance,
        transaction: deductResult.transaction,
      },
    });

  } catch (error: any) {
    console.error('Edit API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
