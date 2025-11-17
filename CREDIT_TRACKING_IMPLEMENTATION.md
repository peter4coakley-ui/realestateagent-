# 💳 Credit Tracking System - Complete Implementation

## ✅ Implementation Summary

Successfully built a comprehensive credit tracking system with real-time monitoring, usage analytics, warning banners, and complete API integration.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│          Credit System Components                      │
│                                                         │
│  /lib/creditSystem.ts                                  │
│  ├─ Balance tracking per brokerage                    │
│  ├─ Transaction history                               │
│  ├─ Usage analytics                                   │
│  └─ Warning thresholds                                │
│                                                         │
│  /app/api/credits/route.ts                            │
│  ├─ GET - Balance & stats                             │
│  ├─ POST - Add credits                                │
│  └─ PUT - Update settings                             │
│                                                         │
│  /components/CreditsOverview.tsx                      │
│  ├─ Real-time balance display                         │
│  ├─ Usage progress bar                                │
│  ├─ Warning banners                                   │
│  └─ Auto-refresh (30s)                                │
└────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│        Edit API Integration                             │
│                                                         │
│  1. Check if sufficient credits                        │
│  2. Deduct credits BEFORE processing                   │
│  3. Call AI editing API                                │
│  4. Refund if edit fails                               │
│  5. Return new balance                                 │
└────────────────────────────────────────────────────────┘
```

---

## 📦 Files Created/Modified

### **1. `/lib/creditSystem.ts`** (500+ lines)

Complete credit management system with:

#### **Core Functions:**
```typescript
// Balance Management
getBalance(brokerageId): Promise<CreditBalance>
hasCredits(brokerageId, required): Promise<boolean>
deductCredits(brokerageId, operation, options): Promise<Result>
addCredits(brokerageId, amount, type): Promise<Result>

// Transaction History
getTransactions(brokerageId, options): Promise<Transaction[]>
getUsageStats(brokerageId, days): Promise<UsageStats>
getMonthlyUsage(brokerageId): Promise<number>

// Utilities
getCreditCost(operation): number
getCreditWarning(balance): Warning | null
formatCredits(credits): string
getUsagePercentage(balance): number
```

#### **Credit Costs:**
```typescript
const CREDIT_COSTS = {
  flooring: 1,
  walls: 1,
  furniture: 1,
  remove: 2,      // More expensive
  masking: 1,
  exterior: 2,    // More expensive
  default: 1,
};
```

#### **Warning Thresholds:**
```typescript
const WARNING_THRESHOLDS = {
  critical: 10,   // Red warning
  warning: 50,    // Yellow warning
  info: 100,      // Blue info
};
```

#### **Data Structures:**
```typescript
interface CreditBalance {
  brokerageId: string;
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  usedThisMonth: number;
  lastUpdated: Date;
}

interface CreditTransaction {
  id: string;
  brokerageId: string;
  amount: number;
  type: 'purchase' | 'usage' | 'refund' | 'adjustment';
  operation?: string;
  imageId?: string;
  listingId?: string;
  userId?: string;
  description: string;
  timestamp: Date;
  balanceBefore: number;
  balanceAfter: number;
}

interface CreditWarning {
  level: 'info' | 'warning' | 'critical';
  message: string;
  threshold: number;
  remaining: number;
}
```

---

### **2. `/app/api/credits/route.ts`** (140+ lines)

RESTful API for credit management:

#### **GET /api/credits** - Get Balance & Stats
```typescript
// Basic balance
GET /api/credits?brokerageId=xxx

Response:
{
  "success": true,
  "data": {
    "brokerageId": "demo-brokerage",
    "totalCredits": 1000,
    "usedCredits": 120,
    "remainingCredits": 880,
    "usedThisMonth": 45,
    "lastUpdated": "2025-11-17T...",
    "warning": {
      "level": "info",
      "message": "You have 880 credits remaining.",
      "threshold": 100,
      "remaining": 880
    },
    "usagePercentage": 12,
    "formatted": {
      "total": "1,000",
      "used": "120",
      "remaining": "880",
      "usedThisMonth": "45"
    }
  }
}
```

#### **GET /api/credits?action=transactions** - Transaction History
```typescript
GET /api/credits?brokerageId=xxx&action=transactions&limit=50

Response:
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "tx-1234...",
        "amount": -1,
        "type": "usage",
        "operation": "walls",
        "description": "walls edit on image img-5678",
        "timestamp": "2025-11-17T10:30:00Z",
        "balanceBefore": 881,
        "balanceAfter": 880
      }
    ],
    "count": 50,
    "offset": 0,
    "limit": 50
  }
}
```

#### **GET /api/credits?action=stats** - Usage Statistics
```typescript
GET /api/credits?brokerageId=xxx&action=stats&days=30

Response:
{
  "success": true,
  "data": {
    "daily": [
      { "date": "2025-11-17", "count": 12 },
      { "date": "2025-11-16", "count": 8 }
    ],
    "byOperation": [
      { "operation": "walls", "count": 45, "credits": 45 },
      { "operation": "flooring", "count": 32, "credits": 32 },
      { "operation": "remove", "count": 10, "credits": 20 }
    ],
    "topUsers": [
      { "userId": "user-123", "count": 67 },
      { "userId": "user-456", "count": 53 }
    ]
  }
}
```

#### **POST /api/credits** - Add Credits
```typescript
POST /api/credits

Request:
{
  "brokerageId": "demo-brokerage",
  "amount": 500,
  "type": "purchase",
  "description": "Credit purchase - $99"
}

Response:
{
  "success": true,
  "data": {
    "newBalance": 1380,
    "transaction": { ... },
    "formatted": "1,380"
  }
}
```

---

### **3. `/components/CreditsOverview.tsx`** (200+ lines)

Beautiful dashboard widget with real-time updates:

#### **Key Features:**
✅ **Auto-refresh** every 30 seconds  
✅ **Warning banners** (critical/warning/info)  
✅ **Progress bar** with color coding  
✅ **Usage statistics** (month/all-time)  
✅ **Purchase button** integration  
✅ **Loading states**  
✅ **Error handling**  

#### **UI Components:**
1. **Warning Banner** (Top) - Red/Yellow/Blue based on level
2. **Main Card** - Gradient background with large credit number
3. **Progress Bar** - Visual usage indicator
4. **Stats Grid** - Month/All-time breakdown
5. **Quick Stats** - Available/This Month/All Time
6. **Purchase Button** - Call-to-action
7. **Last Updated** - Timestamp

#### **Warning Levels:**
```typescript
// Critical (≤10 credits)
<div className="bg-red-50 border-red-200 text-red-900">
  "Critical: Only 8 credits remaining!"
</div>

// Warning (≤50 credits)
<div className="bg-yellow-50 border-yellow-200 text-yellow-900">
  "Warning: Only 42 credits remaining."
</div>

// Info (≤100 credits)
<div className="bg-blue-50 border-blue-200 text-blue-900">
  "You have 87 credits remaining."
</div>
```

---

### **4. `/app/api/edit/route.ts`** - Updated

Enhanced with full credit tracking:

#### **Flow:**
```typescript
1. Validate request
2. Get credit cost for operation
3. Check if has sufficient credits
4. Deduct credits (before processing)
5. Call Nano Banana AI
6. If success → Return result
7. If failure → Refund credits
```

#### **Credit Integration:**
```typescript
// Check credits
const creditCost = getCreditCost(operationType);
const hasSufficientCredits = await hasCredits(brokerageId, creditCost);

if (!hasSufficientCredits) {
  return 402 Payment Required
}

// Deduct credits
const deductResult = await deductCredits(brokerageId, operationType, {
  imageId,
  listingId,
  userId,
  description: `${operationType} edit on image ${imageId}`,
});

// Process edit
const result = await nanoBanana.applyEdit(...);

// If failed, refund
if (!result.success) {
  await addCredits(brokerageId, creditCost, 'refund', ...);
}

// Return with credit info
return {
  success: true,
  data: {
    resultUrl: result.resultUrl,
    creditsUsed: creditCost,
    remainingCredits: deductResult.newBalance,
    transaction: deductResult.transaction,
  }
};
```

---

### **5. `/app/dashboard/page.tsx`** - Updated

Added CreditsOverview widget:

```tsx
<div className="mb-8">
  <CreditsOverview 
    brokerageId="demo-brokerage"
    showDetails={true}
    onPurchaseClick={() => alert('Navigate to purchase credits page')}
  />
</div>
```

---

## 🎯 Features

### **Real-Time Tracking**
- ✅ Every edit deducts credits immediately
- ✅ Balance updates in real-time
- ✅ Transaction history recorded
- ✅ Monthly usage tracked separately

### **Usage Analytics**
- ✅ Daily usage breakdown
- ✅ By operation type
- ✅ Top users
- ✅ Historical trends

### **Warning System**
- ✅ **Critical** (≤10): Red banner, urgent action
- ✅ **Warning** (≤50): Yellow banner, buy soon
- ✅ **Info** (≤100): Blue banner, heads up

### **Transaction Types**
- **purchase** - Buying new credits
- **usage** - Consuming credits for edits
- **refund** - Failed edit refund
- **adjustment** - Admin corrections

---

## 💳 Credit Flow

### **Successful Edit:**
```
1. User triggers edit
2. Check: Has 880 credits (need 1)
3. Deduct: 880 → 879 credits
4. Transaction: {
     amount: -1,
     type: 'usage',
     operation: 'walls',
     balanceBefore: 880,
     balanceAfter: 879
   }
5. Process AI edit
6. Return result + new balance
```

### **Failed Edit (with Refund):**
```
1. User triggers edit
2. Check: Has 50 credits (need 2)
3. Deduct: 50 → 48 credits
4. Process AI edit → FAILS
5. Refund: 48 → 50 credits
6. Transaction: {
     amount: 2,
     type: 'refund',
     description: 'Refund for failed remove edit'
   }
7. Return error
```

### **Insufficient Credits:**
```
1. User triggers edit
2. Check: Has 5 credits (need 10)
3. Return 402 Payment Required:
   {
     error: 'Insufficient credits',
     required: 10,
     remaining: 5
   }
4. Show purchase prompt
```

---

## 📊 Dashboard Integration

### **CreditsOverview Display:**
```
┌──────────────────────────────────────────────┐
│ ⚠️  Warning: Only 45 credits remaining.     │
│     [Purchase more credits]                  │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  AI Credits                          ⚡       │
│  45 / 1,000                                  │
│  ████████░░░░░░░░░░░░░░░░░░░░ 4% used       │
│                                              │
│  Used This Month: 45    Total Used: 955     │
│  [Purchase More Credits]                     │
└──────────────────────────────────────────────┘

┌────────────┬────────────┬────────────┐
│ Available  │ This Month │ All Time   │
│    45      │     45     │    955     │
└────────────┴────────────┴────────────┘

Last updated: 2:45:32 PM
```

---

## 🔔 Warning Banners

### **Critical Level (<= 10 credits):**
```tsx
<div className="bg-red-50 border-red-200 text-red-900 p-4">
  <svg>⚠️</svg>
  <div>
    <p>Critical: Only 8 credits remaining!</p>
    <button>Purchase more credits</button>
  </div>
</div>
```

### **Warning Level (<= 50 credits):**
```tsx
<div className="bg-yellow-50 border-yellow-200 text-yellow-900 p-4">
  <svg>ℹ️</svg>
  <div>
    <p>Warning: Only 45 credits remaining.</p>
    <button>Purchase more credits</button>
  </div>
</div>
```

---

## 🎨 Visual Design

### **Progress Bar Colors:**
- **Green** (0-74% used) - Healthy
- **Yellow** (75-89% used) - Getting low
- **Red** (90%+ used) - Critical

### **Card Gradient:**
```css
bg-gradient-to-br from-blue-50 to-indigo-50
border-2 border-blue-200
```

### **Warning Colors:**
```css
Critical: bg-red-50 border-red-200 text-red-900
Warning:  bg-yellow-50 border-yellow-200 text-yellow-900
Info:     bg-blue-50 border-blue-200 text-blue-900
```

---

## 📈 Usage Analytics

### **Daily Breakdown:**
```
Day          Credits Used
Nov 17       12 credits
Nov 16       8 credits
Nov 15       15 credits
Nov 14       10 credits
```

### **By Operation:**
```
Operation    Count    Credits
Walls        45       45
Flooring     32       32
Remove       10       20  (2 credits each)
Furniture    28       28
Exterior     5        10  (2 credits each)
```

### **Top Users:**
```
User           Edits
agent-123      67
agent-456      53
agent-789      41
```

---

## 🔧 Configuration

### **Credit Costs** (customizable):
```typescript
export const CREDIT_COSTS = {
  flooring: 1,
  walls: 1,
  furniture: 1,
  remove: 2,      // Adjust based on AI cost
  masking: 1,
  exterior: 2,    // Adjust based on AI cost
  default: 1,
};
```

### **Warning Thresholds** (customizable):
```typescript
export const WARNING_THRESHOLDS = {
  critical: 10,   // Show red alert
  warning: 50,    // Show yellow alert
  info: 100,      // Show blue info
};
```

### **Auto-Refresh Interval:**
```typescript
// CreditsOverview component
const interval = setInterval(fetchCredits, 30000); // 30 seconds
```

---

## 🚀 Production Readiness

### **Current State: Development**
✅ In-memory storage (Map/Array)  
✅ Real-time tracking  
✅ Transaction history  
✅ Warning system  
✅ API endpoints  
✅ Dashboard widget  

### **Production TODO:**
1. **Database Migration**
   ```sql
   CREATE TABLE credit_balances (
     brokerage_id UUID PRIMARY KEY,
     total_credits INTEGER NOT NULL,
     used_credits INTEGER NOT NULL,
     remaining_credits INTEGER NOT NULL,
     used_this_month INTEGER NOT NULL,
     last_updated TIMESTAMP NOT NULL
   );

   CREATE TABLE credit_transactions (
     id UUID PRIMARY KEY,
     brokerage_id UUID NOT NULL,
     amount INTEGER NOT NULL,
     type VARCHAR(20) NOT NULL,
     operation VARCHAR(50),
     image_id UUID,
     listing_id UUID,
     user_id UUID,
     description TEXT,
     timestamp TIMESTAMP NOT NULL,
     balance_before INTEGER NOT NULL,
     balance_after INTEGER NOT NULL
   );

   CREATE INDEX idx_transactions_brokerage ON credit_transactions(brokerage_id);
   CREATE INDEX idx_transactions_timestamp ON credit_transactions(timestamp);
   ```

2. **Cron Jobs**
   - Reset monthly usage (1st of each month)
   - Generate usage reports
   - Send low credit emails

3. **Email Notifications**
   - Low balance warnings
   - Monthly usage summary
   - Purchase confirmations

4. **Payment Integration**
   - Stripe checkout
   - Credit packages
   - Auto-refill option

---

## 📊 Build Status

**Successfully compiled!** 🚀

```
Route (app)                    Size     First Load JS
├ ○ /dashboard                 3.73 kB        97.6 kB
├ ƒ /api/credits               0 B            0 B
├ ƒ /api/edit                  0 B            0 B
```

**New route**: `/api/credits`  
**Updated**: Dashboard with CreditsOverview  
**Enhanced**: Edit API with full tracking  

---

## 🎉 Summary

**Complete credit tracking system** featuring:

- 💳 **Real-time balance tracking** per brokerage
- 📊 **Usage analytics** with daily/operation breakdowns
- ⚠️ **Warning banners** (critical/warning/info levels)
- 🔄 **Auto-refresh** every 30 seconds
- 📝 **Transaction history** with full details
- 💸 **Automatic refunds** on failed edits
- 🎨 **Beautiful UI** with progress bars and stats
- ✅ **Production-ready** architecture

---

**Ready to track every AI edit and prevent credit overages!** 🚀💳

*Built with Next.js 14, TypeScript, and in-memory storage (ready for database migration)*
