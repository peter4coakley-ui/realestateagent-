# Real Estate Image Editing SaaS - Architecture & File Structure

## System Architecture Overview

### Multi-Tenant Hierarchy
```
Brokerage (Tenant)
  ├── Agents (Users with brokerage access)
  │   ├── Listings (Collections of images)
  │   │   └── Images (Individual photos)
  │   └── Share Links (Tokenized buyer access)
  └── Credits (Pooled credits for all agents)
```

### Key Architectural Decisions

1. **Next.js App Router**: File-based routing with server components
2. **Authentication**: NextAuth.js or Clerk for multi-tenant auth
3. **Database**: PostgreSQL (via Prisma ORM) for relational data
4. **File Storage**: AWS S3 / Cloudflare R2 for original & edited images
5. **AI Integration**: Google Nano Banana API for image transformations
6. **State Management**: React Context + Zustand for client state
7. **Image Processing**: Canvas API + Fabric.js for client-side manipulation
8. **Real-time**: WebSockets (optional) for collaborative editing

---

## Recommended File Structure

```
/workspace
├── app/                                    # Next.js App Router
│   ├── (auth)/                             # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/                        # Protected dashboard routes
│   │   ├── layout.tsx                      # Dashboard layout with sidebar
│   │   ├── page.tsx                        # Dashboard home (listings overview)
│   │   │
│   │   ├── listings/                       # Listings management
│   │   │   ├── page.tsx                    # List all listings
│   │   │   ├── [id]/                       # Single listing
│   │   │   │   ├── page.tsx                # Listing detail view
│   │   │   │   └── edit/                   # Image editor
│   │   │   │       └── [imageId]/
│   │   │   │           └── page.tsx        # Editor page
│   │   │   └── new/
│   │   │       └── page.tsx                # Create new listing
│   │   │
│   │   ├── credits/                        # Credit management
│   │   │   └── page.tsx
│   │   │
│   │   ├── settings/                       # Brokerage/agent settings
│   │   │   ├── page.tsx
│   │   │   ├── branding/                   # White-label customization
│   │   │   │   └── page.tsx
│   │   │   └── team/                       # Agent management
│   │   │       └── page.tsx
│   │   │
│   │   └── share-links/                    # Manage share links
│   │       ├── page.tsx
│   │       └── [token]/
│   │           └── page.tsx
│   │
│   ├── (public)/                           # Public buyer access routes
│   │   ├── edit/[token]/                   # Tokenized buyer editor
│   │   │   ├── page.tsx                    # Buyer-facing editor
│   │   │   └── layout.tsx                  # Minimal layout (no auth)
│   │   └── layout.tsx
│   │
│   ├── api/                                # API routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts                # NextAuth handler
│   │   │
│   │   ├── images/
│   │   │   ├── upload/
│   │   │   │   └── route.ts                # Upload image to S3
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts                # GET/PUT/DELETE image
│   │   │   │   ├── edit/
│   │   │   │   │   └── route.ts            # Apply AI edit
│   │   │   │   └── download/
│   │   │   │       └── route.ts            # Download with watermark
│   │   │   └── history/
│   │   │       └── route.ts                # Get edit history
│   │   │
│   │   ├── listings/
│   │   │   ├── route.ts                    # GET/POST listings
│   │   │   └── [id]/
│   │   │       ├── route.ts                # GET/PUT/DELETE listing
│   │   │       ├── images/
│   │   │       │   └── route.ts            # Manage listing images
│   │   │       └── share-links/
│   │   │           └── route.ts            # Generate share links
│   │   │
│   │   ├── credits/
│   │   │   ├── route.ts                    # GET credits balance
│   │   │   └── usage/
│   │   │       └── route.ts                # GET credit usage history
│   │   │
│   │   ├── ai/
│   │   │   ├── analyze/
│   │   │   │   └── route.ts                # Nano Banana vision analysis
│   │   │   ├── suggest/
│   │   │   │   └── route.ts                # Generate edit suggestions
│   │   │   ├── transform/
│   │   │   │   └── route.ts                # Apply transformation
│   │   │   ├── stage/
│   │   │   │   └── route.ts                # Add staging furniture
│   │   │   └── inpaint/
│   │   │       └── route.ts                # Inpainting/masking
│   │   │
│   │   └── share-links/
│   │       ├── route.ts                    # Create share link
│   │       └── [token]/
│   │           ├── route.ts                # Validate token
│   │           └── verify/
│   │               └── route.ts
│   │
│   ├── layout.tsx                          # Root layout
│   ├── page.tsx                            # Landing page
│   └── globals.css                         # Global styles + Tailwind
│
├── components/                             # React components
│   ├── ui/                                 # Base UI components (shadcn/ui style)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   │
│   ├── dashboard/                          # Dashboard-specific components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── CreditsDisplay.tsx
│   │   ├── ListingsGrid.tsx
│   │   ├── ListingCard.tsx
│   │   └── ShareLinkManager.tsx
│   │
│   ├── editor/                            # Image editor components
│   │   ├── ImageEditor.tsx                 # Main editor container
│   │   ├── CanvasViewport.tsx              # Canvas display area
│   │   ├── Toolbar.tsx                     # Editing tools
│   │   ├── EditPanel.tsx                   # Side panel for edit options
│   │   ├── ChatEditor.tsx                  # Chat-to-edit interface
│   │   ├── SuggestionPanel.tsx             # AI suggestions display
│   │   ├── HistoryTimeline.tsx             # Undo/redo timeline
│   │   ├── MaskingTool.tsx                 # Precise masking interface
│   │   ├── StagingPanel.tsx                # Furniture staging UI
│   │   ├── ColorPicker.tsx                 # Floor/wall color picker
│   │   └── WatermarkControls.tsx           # Watermark options
│   │
│   ├── buyer/                              # Buyer-facing components
│   │   ├── BuyerEditor.tsx                 # Simplified editor for buyers
│   │   └── BuyerToolbar.tsx
│   │
│   └── shared/                             # Shared components
│       ├── ImageUploader.tsx
│       ├── ImageGallery.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
│
├── lib/                                    # Utility libraries
│   ├── db/                                 # Database client
│   │   ├── prisma.ts                       # Prisma client singleton
│   │   └── migrations/                     # Prisma migrations
│   │
│   ├── ai/                                 # AI integration
│   │   ├── nano-banana.ts                  # Nano Banana API client
│   │   ├── vision.ts                       # Vision analysis helpers
│   │   ├── transformations.ts              # Transform type definitions
│   │   └── prompts.ts                      # AI prompt templates
│   │
│   ├── storage/                            # File storage
│   │   ├── s3.ts                           # S3 client & helpers
│   │   └── image-processor.ts              # Image processing utilities
│   │
│   ├── auth/                               # Authentication
│   │   ├── config.ts                       # Auth configuration
│   │   └── middleware.ts                   # Auth middleware
│   │
│   ├── utils/                              # General utilities
│   │   ├── cn.ts                           # className utility
│   │   ├── format.ts                       # Formatting helpers
│   │   └── validation.ts                   # Zod schemas
│   │
│   └── hooks/                              # Custom React hooks
│       ├── useImageEditor.ts               # Editor state management
│       ├── useEditHistory.ts               # Undo/redo logic
│       ├── useCredits.ts                   # Credit tracking
│       └── useChatEditor.ts                # Chat editor logic
│
├── types/                                  # TypeScript definitions
│   ├── database.ts                         # Prisma-generated types
│   ├── api.ts                              # API request/response types
│   ├── editor.ts                           # Editor state types
│   ├── ai.ts                               # AI transformation types
│   └── auth.ts                             # Auth types
│
├── store/                                  # State management (Zustand)
│   ├── editorStore.ts                      # Editor state
│   ├── creditsStore.ts                     # Credits state
│   └── authStore.ts                        # Auth state
│
├── config/                                 # Configuration files
│   ├── env.ts                              # Environment variables
│   └── constants.ts                        # App constants
│
├── middleware.ts                           # Next.js middleware (auth)
│
├── prisma/
│   ├── schema.prisma                       # Database schema
│   └── seed.ts                             # Seed script
│
├── public/                                 # Static assets
│   ├── images/
│   └── icons/
│
├── .env.local                              # Environment variables (gitignored)
├── .env.example                            # Example env file
├── tailwind.config.ts                      # Tailwind configuration
├── postcss.config.js                       # PostCSS config
├── next.config.js                          # Next.js config
├── package.json
├── tsconfig.json
└── ARCHITECTURE.md                         # This file
```

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

model Brokerage {
  id            String   @id @default(cuid())
  name          String
  subdomain     String?  @unique  // For white-labeling
  logo          String?
  primaryColor  String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  agents        Agent[]
  credits       Credit[]
  listings      Listing[]
  settings      BrokerageSettings?
}

model Agent {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String
  password    String   // Hashed
  role        Role     @default(AGENT)
  brokerageId String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  brokerage   Brokerage @relation(fields: [brokerageId], references: [id])
  listings    Listing[]
  shareLinks  ShareLink[]
}

model Listing {
  id          String   @id @default(cuid())
  title       String
  address     String?
  agentId     String
  brokerageId String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  agent       Agent        @relation(fields: [agentId], references: [id])
  brokerage   Brokerage    @relation(fields: [brokerageId], references: [id])
  images      Image[]
  shareLinks  ShareLink[]
}

model Image {
  id            String   @id @default(cuid())
  listingId     String
  originalUrl   String   // S3 URL
  currentUrl    String   // Current edited version
  filename      String
  order         Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  listing       Listing      @relation(fields: [listingId], references: [id])
  editHistory   EditHistory[]
  creditsUsed   CreditUsage[]
}

model EditHistory {
  id          String   @id @default(cuid())
  imageId     String
  editType    EditType
  editData    Json     // Transformation parameters
  imageUrl    String   // Snapshot after edit
  order       Int      // For undo/redo ordering
  createdAt   DateTime @default(now())
  
  image       Image    @relation(fields: [imageId], references: [id])
}

model ShareLink {
  id          String   @id @default(cuid())
  token       String   @unique
  listingId   String
  agentId     String
  expiresAt   DateTime?
  maxUses     Int?
  useCount    Int      @default(0)
  createdAt   DateTime @default(now())
  
  listing     Listing  @relation(fields: [listingId], references: [id])
  agent       Agent    @relation(fields: [agentId], references: [id])
}

model Credit {
  id            String   @id @default(cuid())
  brokerageId   String
  amount        Int      // Credits purchased/added
  type          CreditType
  description   String?
  createdAt     DateTime @default(now())
  
  brokerage     Brokerage   @relation(fields: [brokerageId], references: [id])
  usage         CreditUsage[]
}

model CreditUsage {
  id          String   @id @default(cuid())
  creditId    String
  imageId     String
  editType    EditType
  createdAt   DateTime @default(now())
  
  credit      Credit  @relation(fields: [creditId], references: [id])
  image       Image   @relation(fields: [imageId], references: [id])
}

model BrokerageSettings {
  id            String   @id @default(cuid())
  brokerageId   String   @unique
  watermarkText String?
  watermarkLogo String?
  defaultCreditAmount Int @default(0)
  
  brokerage     Brokerage @relation(fields: [brokerageId], references: [id])
}

enum Role {
  BROKERAGE_ADMIN
  AGENT
}

enum EditType {
  FLOOR_CHANGE
  WALL_COLOR
  STAGING_ADD
  STAGING_REMOVE
  OBJECT_REMOVAL
  EXTERIOR_SNOW_REMOVAL
  EXTERIOR_GRASS_ENHANCEMENT
  EXTERIOR_SIDING_COLOR
  EXTERIOR_SKY_IMPROVEMENT
  GENERAL_ENHANCEMENT
  INPAINTING
  MASKING
}

enum CreditType {
  PURCHASE
  BONUS
  REFUND
}
```

---

## Key Architecture Patterns

### 1. **Multi-Tenancy**
- Brokerage-level isolation via `brokerageId` foreign keys
- Middleware validates tenant access on all routes
- White-labeling via `BrokerageSettings` (logo, colors, watermark)

### 2. **Image Editing Flow**
```
1. Upload → S3 → Store metadata in DB
2. Load image → Canvas/Fabric.js for display
3. User selects edit → Generate mask/prompt → Call Nano Banana API
4. Receive edited image → Store in S3 → Create EditHistory entry
5. Deduct credit → Update UI → Add to undo stack
```

### 3. **Chat-to-Edit Flow**
```
1. User types command → Send to /api/ai/analyze
2. Nano Banana vision analysis → Generate suggestions
3. User confirms → Apply transformation → Same flow as above
```

### 4. **Share Link Security**
- Cryptographically secure tokens (crypto.randomBytes)
- Expiration dates & usage limits
- Read-only access (buyers can't modify listings, only edit images)
- Temporary session storage for buyer edits

### 5. **Credit System**
- Atomic transactions (deduct before API call, refund on failure)
- Per-image tracking via `CreditUsage`
- Real-time balance updates via WebSocket or polling
- Brokerage-level pooling

### 6. **Undo/Redo Implementation**
- `EditHistory` table stores snapshots
- Client-side stack for fast UI updates
- Server-side history for persistence
- Limit history depth (e.g., 50 edits)

---

## API Route Patterns

### Image Editing Endpoint
```typescript
// app/api/images/[id]/edit/route.ts
POST /api/images/[id]/edit
Body: {
  editType: EditType
  parameters: {
    mask?: string  // Base64 mask image
    color?: string
    furnitureType?: string
    prompt?: string
  }
}
Response: {
  success: boolean
  editedImageUrl: string
  creditsRemaining: number
  editHistoryId: string
}
```

### Chat Editor Endpoint
```typescript
// app/api/ai/analyze/route.ts
POST /api/ai/analyze
Body: {
  imageUrl: string
  prompt: string
}
Response: {
  suggestions: Array<{
    type: EditType
    description: string
    confidence: number
  }>
  analysis: string  // Natural language description
}
```

---

## Component Architecture

### Editor State Management
```typescript
// store/editorStore.ts
interface EditorState {
  currentImage: Image | null
  editHistory: EditHistory[]
  currentHistoryIndex: number
  isProcessing: boolean
  canvasRef: RefObject<HTMLCanvasElement>
  
  // Actions
  loadImage: (imageId: string) => Promise<void>
  applyEdit: (edit: EditParams) => Promise<void>
  undo: () => void
  redo: () => void
  reset: () => void
}
```

### Credit Tracking Hook
```typescript
// lib/hooks/useCredits.ts
export function useCredits() {
  const { credits, deductCredit, refreshCredits } = useCreditsStore()
  
  const applyEditWithCredits = async (editFn: () => Promise<void>) => {
    if (credits < 1) throw new Error('Insufficient credits')
    
    try {
      await deductCredit()
      await editFn()
    } catch (error) {
      await refundCredit() // Rollback on failure
      throw error
    }
  }
  
  return { credits, applyEditWithCredits, refreshCredits }
}
```

---

## Security Considerations

1. **Authentication**: JWT tokens, secure session management
2. **Authorization**: Role-based access control (RBAC)
3. **File Upload**: Validate file types, scan for malware, size limits
4. **API Rate Limiting**: Prevent abuse of AI endpoints
5. **Credit Validation**: Server-side validation, prevent double-spending
6. **Share Links**: Secure token generation, expiration enforcement
7. **CORS**: Restrict API access to authorized domains
8. **Data Isolation**: Ensure brokerage data separation at DB level

---

## Performance Optimizations

1. **Image Optimization**: Next.js Image component, WebP conversion
2. **Caching**: Redis for frequently accessed data
3. **CDN**: CloudFront/Cloudflare for image delivery
4. **Lazy Loading**: Code splitting for editor components
5. **Debouncing**: Chat input debouncing for API calls
6. **Optimistic Updates**: UI updates before API confirmation
7. **Background Processing**: Queue system for heavy AI operations

---

## Environment Variables

```bash
# Database
DATABASE_URL=

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Storage
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_REGION=

# AI
GOOGLE_NANO_BANANA_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Next Steps

1. Set up Prisma schema and run migrations
2. Configure authentication (NextAuth.js)
3. Set up S3 storage integration
4. Create Nano Banana API client
5. Build core editor components
6. Implement credit system
7. Add share link functionality
8. Build buyer-facing editor
9. Add white-labeling support
10. Implement analytics & monitoring

---

This architecture provides a scalable, maintainable foundation for your real estate image editing SaaS platform.
