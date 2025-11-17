import { NextRequest, NextResponse } from 'next/server';
import {
  generateShareToken,
  validateShareToken,
  saveShareLink,
  trackShareAccess,
  getShareLinkAnalytics,
  revokeShareLink,
  formatExpirationDate,
} from '@/lib/sharing';

export const maxDuration = 10;

/**
 * POST /api/share - Create a new share link
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingId, brokerageId, agentId, expiresInDays = 7 } = body;

    // Validate required fields
    if (!listingId) {
      return NextResponse.json(
        { success: false, error: 'Missing listingId' },
        { status: 400 }
      );
    }

    // Generate share token
    const shareLink = await generateShareToken(
      listingId,
      brokerageId || 'mock-brokerage',
      agentId || 'mock-agent',
      expiresInDays
    );

    // Save to database
    await saveShareLink(shareLink);

    return NextResponse.json({
      success: true,
      data: {
        token: shareLink.token,
        url: shareLink.url,
        expiresAt: shareLink.expiresAt,
        expiresIn: formatExpirationDate(shareLink.expiresAt.getTime()),
        listingId: shareLink.listingId,
      },
    });
  } catch (error: any) {
    console.error('Share link creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create share link' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/share?token=xxx - Validate a share token
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');
    const action = searchParams.get('action');
    const listingId = searchParams.get('listingId');

    // Validate token
    if (action === 'validate' && token) {
      const result = await validateShareToken(token);

      if (!result.valid) {
        return NextResponse.json({
          success: false,
          error: result.error,
        });
      }

      // Track access
      await trackShareAccess(token);

      return NextResponse.json({
        success: true,
        data: {
          valid: true,
          listingId: result.payload?.listingId,
          brokerageId: result.payload?.brokerageId,
          permissions: result.payload?.permissions,
          expiresAt: result.payload?.expiresAt,
          expiresIn: formatExpirationDate(result.payload!.expiresAt),
        },
      });
    }

    // Get analytics for a listing
    if (action === 'analytics' && listingId) {
      const analytics = await getShareLinkAnalytics(listingId);
      return NextResponse.json({
        success: true,
        data: analytics,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Share link validation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Validation failed' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/share - Revoke a share link
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Missing token' },
        { status: 400 }
      );
    }

    const revoked = await revokeShareLink(token);

    if (!revoked) {
      return NextResponse.json(
        { success: false, error: 'Share link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Share link revoked',
    });
  } catch (error: any) {
    console.error('Share link revocation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Revocation failed' },
      { status: 500 }
    );
  }
}
