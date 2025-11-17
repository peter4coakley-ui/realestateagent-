/**
 * Credit System for AI Image Editing
 * Tracks credit usage per brokerage with real-time updates
 */

export interface CreditTransaction {
  id: string;
  brokerageId: string;
  amount: number;
  type: 'purchase' | 'usage' | 'refund' | 'adjustment';
  operation?: string; // e.g., 'flooring', 'walls', 'furniture'
  imageId?: string;
  listingId?: string;
  userId?: string;
  description: string;
  timestamp: Date;
  balanceBefore: number;
  balanceAfter: number;
}

export interface CreditBalance {
  brokerageId: string;
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  usedThisMonth: number;
  lastUpdated: Date;
}

export interface CreditUsageStats {
  daily: { date: string; count: number }[];
  weekly: { week: string; count: number }[];
  monthly: { month: string; count: number }[];
  byOperation: { operation: string; count: number; credits: number }[];
  topUsers: { userId: string; count: number }[];
}

export interface CreditWarning {
  level: 'info' | 'warning' | 'critical';
  message: string;
  threshold: number;
  remaining: number;
}

// Cost per operation type (can be customized)
export const CREDIT_COSTS: Record<string, number> = {
  flooring: 1,
  walls: 1,
  furniture: 1,
  remove: 2,
  masking: 1,
  exterior: 2,
  default: 1,
};

// Warning thresholds
export const WARNING_THRESHOLDS = {
  critical: 10, // Less than 10 credits
  warning: 50,  // Less than 50 credits
  info: 100,    // Less than 100 credits
};

// In-memory storage (replace with database in production)
const creditBalances = new Map<string, CreditBalance>();
const creditTransactions: CreditTransaction[] = [];

// Initialize default balances for development
function initializeBrokerage(brokerageId: string): CreditBalance {
  const balance: CreditBalance = {
    brokerageId,
    totalCredits: 1000,
    usedCredits: 0,
    remainingCredits: 1000,
    usedThisMonth: 0,
    lastUpdated: new Date(),
  };
  creditBalances.set(brokerageId, balance);
  return balance;
}

/**
 * Get credit balance for a brokerage
 */
export async function getBalance(brokerageId: string): Promise<CreditBalance> {
  let balance = creditBalances.get(brokerageId);
  
  if (!balance) {
    balance = initializeBrokerage(brokerageId);
  }
  
  return balance;
}

/**
 * Check if brokerage has sufficient credits
 */
export async function hasCredits(
  brokerageId: string,
  requiredCredits: number = 1
): Promise<boolean> {
  const balance = await getBalance(brokerageId);
  return balance.remainingCredits >= requiredCredits;
}

/**
 * Deduct credits for an operation
 */
export async function deductCredits(
  brokerageId: string,
  operation: string,
  options: {
    imageId?: string;
    listingId?: string;
    userId?: string;
    description?: string;
  } = {}
): Promise<{ success: boolean; newBalance: number; transaction?: CreditTransaction }> {
  const balance = await getBalance(brokerageId);
  const cost = CREDIT_COSTS[operation] || CREDIT_COSTS.default;

  if (balance.remainingCredits < cost) {
    return {
      success: false,
      newBalance: balance.remainingCredits,
    };
  }

  // Create transaction
  const transaction: CreditTransaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    brokerageId,
    amount: -cost,
    type: 'usage',
    operation,
    imageId: options.imageId,
    listingId: options.listingId,
    userId: options.userId,
    description: options.description || `${operation} edit`,
    timestamp: new Date(),
    balanceBefore: balance.remainingCredits,
    balanceAfter: balance.remainingCredits - cost,
  };

  // Update balance
  balance.usedCredits += cost;
  balance.remainingCredits -= cost;
  balance.usedThisMonth += cost;
  balance.lastUpdated = new Date();

  // Store transaction
  creditTransactions.push(transaction);
  creditBalances.set(brokerageId, balance);

  return {
    success: true,
    newBalance: balance.remainingCredits,
    transaction,
  };
}

/**
 * Add credits to a brokerage (purchase or refund)
 */
export async function addCredits(
  brokerageId: string,
  amount: number,
  type: 'purchase' | 'refund' | 'adjustment' = 'purchase',
  description?: string
): Promise<{ success: boolean; newBalance: number; transaction: CreditTransaction }> {
  const balance = await getBalance(brokerageId);

  const transaction: CreditTransaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    brokerageId,
    amount,
    type,
    description: description || `Credit ${type}`,
    timestamp: new Date(),
    balanceBefore: balance.remainingCredits,
    balanceAfter: balance.remainingCredits + amount,
  };

  balance.totalCredits += amount;
  balance.remainingCredits += amount;
  balance.lastUpdated = new Date();

  creditTransactions.push(transaction);
  creditBalances.set(brokerageId, balance);

  return {
    success: true,
    newBalance: balance.remainingCredits,
    transaction,
  };
}

/**
 * Get transaction history for a brokerage
 */
export async function getTransactions(
  brokerageId: string,
  options: {
    limit?: number;
    offset?: number;
    startDate?: Date;
    endDate?: Date;
    type?: CreditTransaction['type'];
  } = {}
): Promise<CreditTransaction[]> {
  let transactions = creditTransactions.filter(
    (tx) => tx.brokerageId === brokerageId
  );

  // Filter by date range
  if (options.startDate) {
    transactions = transactions.filter(
      (tx) => tx.timestamp >= options.startDate!
    );
  }
  if (options.endDate) {
    transactions = transactions.filter(
      (tx) => tx.timestamp <= options.endDate!
    );
  }

  // Filter by type
  if (options.type) {
    transactions = transactions.filter((tx) => tx.type === options.type);
  }

  // Sort by timestamp (newest first)
  transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Apply pagination
  const offset = options.offset || 0;
  const limit = options.limit || 50;
  return transactions.slice(offset, offset + limit);
}

/**
 * Get credit usage statistics
 */
export async function getUsageStats(
  brokerageId: string,
  days: number = 30
): Promise<CreditUsageStats> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const transactions = await getTransactions(brokerageId, {
    startDate,
    type: 'usage',
  });

  // Daily usage
  const dailyMap = new Map<string, number>();
  transactions.forEach((tx) => {
    const date = tx.timestamp.toISOString().split('T')[0];
    dailyMap.set(date, (dailyMap.get(date) || 0) + Math.abs(tx.amount));
  });

  const daily = Array.from(dailyMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // By operation
  const operationMap = new Map<string, { count: number; credits: number }>();
  transactions.forEach((tx) => {
    if (tx.operation) {
      const current = operationMap.get(tx.operation) || { count: 0, credits: 0 };
      operationMap.set(tx.operation, {
        count: current.count + 1,
        credits: current.credits + Math.abs(tx.amount),
      });
    }
  });

  const byOperation = Array.from(operationMap.entries())
    .map(([operation, stats]) => ({ operation, ...stats }))
    .sort((a, b) => b.count - a.count);

  // Top users
  const userMap = new Map<string, number>();
  transactions.forEach((tx) => {
    if (tx.userId) {
      userMap.set(tx.userId, (userMap.get(tx.userId) || 0) + 1);
    }
  });

  const topUsers = Array.from(userMap.entries())
    .map(([userId, count]) => ({ userId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    daily,
    weekly: [], // TODO: Implement weekly aggregation
    monthly: [], // TODO: Implement monthly aggregation
    byOperation,
    topUsers,
  };
}

/**
 * Get credit usage for current month
 */
export async function getMonthlyUsage(brokerageId: string): Promise<number> {
  const balance = await getBalance(brokerageId);
  return balance.usedThisMonth;
}

/**
 * Reset monthly usage counter (call at start of each month)
 */
export async function resetMonthlyUsage(brokerageId: string): Promise<void> {
  const balance = creditBalances.get(brokerageId);
  if (balance) {
    balance.usedThisMonth = 0;
    balance.lastUpdated = new Date();
    creditBalances.set(brokerageId, balance);
  }
}

/**
 * Check if credits are low and return warning
 */
export function getCreditWarning(balance: CreditBalance): CreditWarning | null {
  const { remainingCredits } = balance;

  if (remainingCredits <= WARNING_THRESHOLDS.critical) {
    return {
      level: 'critical',
      message: `Critical: Only ${remainingCredits} credits remaining!`,
      threshold: WARNING_THRESHOLDS.critical,
      remaining: remainingCredits,
    };
  }

  if (remainingCredits <= WARNING_THRESHOLDS.warning) {
    return {
      level: 'warning',
      message: `Warning: Only ${remainingCredits} credits remaining.`,
      threshold: WARNING_THRESHOLDS.warning,
      remaining: remainingCredits,
    };
  }

  if (remainingCredits <= WARNING_THRESHOLDS.info) {
    return {
      level: 'info',
      message: `You have ${remainingCredits} credits remaining.`,
      threshold: WARNING_THRESHOLDS.info,
      remaining: remainingCredits,
    };
  }

  return null;
}

/**
 * Get credit cost for an operation
 */
export function getCreditCost(operation: string): number {
  return CREDIT_COSTS[operation] || CREDIT_COSTS.default;
}

/**
 * Estimate cost for multiple operations
 */
export function estimateCost(operations: string[]): number {
  return operations.reduce((total, op) => total + getCreditCost(op), 0);
}

/**
 * Format credits for display
 */
export function formatCredits(credits: number): string {
  return credits.toLocaleString();
}

/**
 * Get percentage of credits used
 */
export function getUsagePercentage(balance: CreditBalance): number {
  if (balance.totalCredits === 0) return 0;
  return Math.round((balance.usedCredits / balance.totalCredits) * 100);
}
