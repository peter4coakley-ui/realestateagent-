'use client';

import { useState, useEffect } from 'react';
import { CreditBalance, CreditWarning } from '@/lib/creditSystem';

interface CreditsOverviewProps {
  brokerageId?: string;
  showDetails?: boolean;
  onPurchaseClick?: () => void;
}

export default function CreditsOverview({
  brokerageId = 'demo-brokerage',
  showDetails = true,
  onPurchaseClick,
}: CreditsOverviewProps) {
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [warning, setWarning] = useState<CreditWarning | null>(null);
  const [usagePercentage, setUsagePercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCredits();
    // Refresh every 30 seconds
    const interval = setInterval(fetchCredits, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brokerageId]);

  const fetchCredits = async () => {
    try {
      const response = await fetch(`/api/credits?brokerageId=${brokerageId}`);
      const data = await response.json();

      if (data.success) {
        setBalance(data.data);
        setWarning(data.data.warning);
        setUsagePercentage(data.data.usagePercentage);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch credits');
      }
    } catch (err) {
      console.error('Credits fetch error:', err);
      setError('Failed to load credit information');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    );
  }

  if (!balance) return null;

  const getProgressColor = () => {
    if (usagePercentage >= 90) return 'bg-red-500';
    if (usagePercentage >= 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getWarningStyles = (level: CreditWarning['level']) => {
    switch (level) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  return (
    <div className="space-y-4">
      {/* Warning Banner */}
      {warning && (
        <div className={`rounded-lg border-2 p-4 flex items-start gap-3 ${getWarningStyles(warning.level)}`}>
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {warning.level === 'critical' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
          <div className="flex-1">
            <p className="font-semibold text-sm">{warning.message}</p>
            {onPurchaseClick && (
              <button
                onClick={onPurchaseClick}
                className="mt-2 text-sm font-medium underline hover:no-underline"
              >
                Purchase more credits
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Credits Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">AI Credits</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">
                {balance.remainingCredits.toLocaleString()}
              </span>
              <span className="text-lg text-gray-500">
                / {balance.totalCredits.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="p-3 bg-blue-600 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Usage</span>
            <span>{usagePercentage}% used</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>

        {showDetails && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200">
            <div>
              <p className="text-xs text-gray-600">Used This Month</p>
              <p className="text-lg font-semibold text-gray-900">
                {balance.usedThisMonth.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Used</p>
              <p className="text-lg font-semibold text-gray-900">
                {balance.usedCredits.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {onPurchaseClick && (
          <button
            onClick={onPurchaseClick}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Purchase More Credits
          </button>
        )}
      </div>

      {/* Quick Stats */}
      {showDetails && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-xs text-gray-600">Available</p>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {balance.remainingCredits.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-xs text-gray-600">This Month</p>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {balance.usedThisMonth.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-xs text-gray-600">All Time</p>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {balance.usedCredits.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Last Updated */}
      <p className="text-xs text-gray-500 text-center">
        Last updated: {new Date(balance.lastUpdated).toLocaleTimeString()}
      </p>
    </div>
  );
}
