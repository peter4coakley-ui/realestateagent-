/**
 * Token-based Sharing System
 * Allows agents to generate secure, time-limited access links for buyers
 */

import { SignJWT, jwtVerify } from 'jose';

export interface ShareLinkPayload {
  listingId: string;
  brokerageId: string;
  agentId: string;
  createdAt: number;
  expiresAt: number;
  permissions: {
    canEdit: boolean;
    canDownload: boolean;
    canShare: boolean;
  };
}

export interface ShareLinkData {
  token: string;
  url: string;
  expiresAt: Date;
  listingId: string;
}

export interface ValidatedToken {
  valid: boolean;
  payload?: ShareLinkPayload;
  error?: string;
}

/**
 * Generate a secure JWT token for sharing
 */
export async function generateShareToken(
  listingId: string,
  brokerageId: string,
  agentId: string,
  expiresInDays: number = 7
): Promise<ShareLinkData> {
  const secret = new TextEncoder().encode(
    process.env.NEXTAUTH_SECRET || 'dev-secret-key-change-in-production'
  );

  const now = Date.now();
  const expiresAt = new Date(now + expiresInDays * 24 * 60 * 60 * 1000);

  const payload: ShareLinkPayload = {
    listingId,
    brokerageId,
    agentId,
    createdAt: now,
    expiresAt: expiresAt.getTime(),
    permissions: {
      canEdit: true,
      canDownload: true,
      canShare: false, // Buyers can't re-share
    },
  };

  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now / 1000)
    .setExpirationTime(expiresAt.getTime() / 1000)
    .setSubject(listingId)
    .sign(secret);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const url = `${baseUrl}/edit-access/${token}`;

  return {
    token,
    url,
    expiresAt,
    listingId,
  };
}

/**
 * Validate and decode a share token
 */
export async function validateShareToken(
  token: string
): Promise<ValidatedToken> {
  try {
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || 'dev-secret-key-change-in-production'
    );

    const { payload } = await jwtVerify(token, secret);

    const sharePayload = payload as unknown as ShareLinkPayload;

    // Check expiration
    if (sharePayload.expiresAt < Date.now()) {
      return {
        valid: false,
        error: 'This share link has expired',
      };
    }

    // Verify required fields
    if (!sharePayload.listingId || !sharePayload.brokerageId) {
      return {
        valid: false,
        error: 'Invalid share link',
      };
    }

    return {
      valid: true,
      payload: sharePayload,
    };
  } catch (error: any) {
    console.error('Token validation error:', error);
    return {
      valid: false,
      error: 'Invalid or expired share link',
    };
  }
}

/**
 * Generate a short, user-friendly token (for display purposes)
 */
export function generateShortToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Parse token from URL or request
 */
export function extractToken(urlOrToken: string): string {
  // If it's a full URL, extract the token
  if (urlOrToken.includes('/edit-access/')) {
    const parts = urlOrToken.split('/edit-access/');
    return parts[1] || '';
  }
  // Otherwise, assume it's already a token
  return urlOrToken;
}

/**
 * Check if a token is about to expire (within 24 hours)
 */
export function isTokenExpiringSoon(expiresAt: number): boolean {
  const oneDayMs = 24 * 60 * 60 * 1000;
  return expiresAt - Date.now() < oneDayMs;
}

/**
 * Format expiration date for display
 */
export function formatExpirationDate(expiresAt: number): string {
  const date = new Date(expiresAt);
  const now = Date.now();
  const diffMs = expiresAt - now;
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));

  if (diffMs < 0) {
    return 'Expired';
  } else if (diffDays > 1) {
    return `Expires in ${diffDays} days`;
  } else if (diffHours > 1) {
    return `Expires in ${diffHours} hours`;
  } else {
    return 'Expires soon';
  }
}

/**
 * Mock database functions (replace with real DB in production)
 */

interface ShareRecord {
  id: string;
  token: string;
  listingId: string;
  brokerageId: string;
  agentId: string;
  createdAt: Date;
  expiresAt: Date;
  accessCount: number;
  lastAccessedAt?: Date;
}

// In-memory store for development (use database in production)
const shareLinks: Map<string, ShareRecord> = new Map();

/**
 * Save share link to database
 */
export async function saveShareLink(data: ShareLinkData): Promise<void> {
  // Mock implementation - replace with DB insert
  const record: ShareRecord = {
    id: generateShortToken(),
    token: data.token,
    listingId: data.listingId,
    brokerageId: 'mock-brokerage-id',
    agentId: 'mock-agent-id',
    createdAt: new Date(),
    expiresAt: data.expiresAt,
    accessCount: 0,
  };

  shareLinks.set(data.token, record);

  // In production, insert to database:
  // await db.shareLinks.create({ data: record });
}

/**
 * Track access to share link
 */
export async function trackShareAccess(token: string): Promise<void> {
  // Mock implementation - replace with DB update
  const record = shareLinks.get(token);
  if (record) {
    record.accessCount++;
    record.lastAccessedAt = new Date();
    shareLinks.set(token, record);
  }

  // In production, update database:
  // await db.shareLinks.update({
  //   where: { token },
  //   data: { accessCount: { increment: 1 }, lastAccessedAt: new Date() }
  // });
}

/**
 * Get share link analytics
 */
export async function getShareLinkAnalytics(
  listingId: string
): Promise<ShareRecord[]> {
  // Mock implementation
  const records = Array.from(shareLinks.values()).filter(
    (r) => r.listingId === listingId
  );

  return records;

  // In production:
  // return await db.shareLinks.findMany({ where: { listingId } });
}

/**
 * Revoke a share link
 */
export async function revokeShareLink(token: string): Promise<boolean> {
  // Mock implementation
  const deleted = shareLinks.delete(token);

  // In production:
  // await db.shareLinks.delete({ where: { token } });

  return deleted;
}
