import { NextRequest, NextResponse } from 'next/server';
import {
  getBalance,
  addCredits,
  getTransactions,
  getUsageStats,
  getMonthlyUsage,
  getCreditWarning,
  formatCredits,
  getUsagePercentage,
  type CreditBalance,
} from '@/lib/creditSystem';

export const maxDuration = 10;

/**
 * GET /api/credits - Get credit balance and stats
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const brokerageId = searchParams.get('brokerageId') || 'demo-brokerage';
    const action = searchParams.get('action');

    // Get balance
    if (!action || action === 'balance') {
      const balance = await getBalance(brokerageId);
      const warning = getCreditWarning(balance);
      const usagePercentage = getUsagePercentage(balance);

      return NextResponse.json({
        success: true,
        data: {
          ...balance,
          warning,
          usagePercentage,
          formatted: {
            total: formatCredits(balance.totalCredits),
            used: formatCredits(balance.usedCredits),
            remaining: formatCredits(balance.remainingCredits),
            usedThisMonth: formatCredits(balance.usedThisMonth),
          },
        },
      });
    }

    // Get transaction history
    if (action === 'transactions') {
      const limit = parseInt(searchParams.get('limit') || '50');
      const offset = parseInt(searchParams.get('offset') || '0');
      const type = searchParams.get('type') as any;

      const transactions = await getTransactions(brokerageId, {
        limit,
        offset,
        type,
      });

      return NextResponse.json({
        success: true,
        data: {
          transactions,
          count: transactions.length,
          offset,
          limit,
        },
      });
    }

    // Get usage statistics
    if (action === 'stats') {
      const days = parseInt(searchParams.get('days') || '30');
      const stats = await getUsageStats(brokerageId, days);

      return NextResponse.json({
        success: true,
        data: stats,
      });
    }

    // Get monthly usage
    if (action === 'monthly') {
      const usage = await getMonthlyUsage(brokerageId);

      return NextResponse.json({
        success: true,
        data: {
          usedThisMonth: usage,
          formatted: formatCredits(usage),
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Credits API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch credits' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/credits - Add credits (purchase or admin grant)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brokerageId, amount, type = 'purchase', description } = body;

    if (!brokerageId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing brokerageId or amount' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be positive' },
        { status: 400 }
      );
    }

    const result = await addCredits(brokerageId, amount, type, description);

    return NextResponse.json({
      success: true,
      data: {
        newBalance: result.newBalance,
        transaction: result.transaction,
        formatted: formatCredits(result.newBalance),
      },
    });
  } catch (error: any) {
    console.error('Add credits error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add credits' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/credits - Update credit settings or reset monthly usage
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { brokerageId, action } = body;

    if (!brokerageId) {
      return NextResponse.json(
        { success: false, error: 'Missing brokerageId' },
        { status: 400 }
      );
    }

    if (action === 'reset-monthly') {
      // This would be called by a cron job at the start of each month
      const { resetMonthlyUsage } = await import('@/lib/creditSystem');
      await resetMonthlyUsage(brokerageId);

      return NextResponse.json({
        success: true,
        message: 'Monthly usage reset successfully',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Update credits error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update credits' },
      { status: 500 }
    );
  }
}
