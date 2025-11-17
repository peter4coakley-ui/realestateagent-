# Real Estate Image Editor SaaS

AI-powered image editing platform for real estate brokerages, agents, and buyers.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Nano Banana image editor

## Project Structure

```
/app                    - Next.js app directory (routes & API)
  /dashboard           - Main dashboard
  /editor              - Image editor interface
  /listing/[id]        - Listing details
  /edit-access/[token] - Buyer access via share link
  /api                 - API routes

/components            - React components
  - ImageCanvas        - Main canvas component
  - MaskingTool        - Masking/inpainting tool
  - FurnitureSidebar   - Furniture staging panel
  - ChatEditor         - Chat-based editing interface
  - PhotoStrip         - Image navigation
  - EditHistory        - Undo/redo history
  - TopActionBar       - Editor toolbar
  /ui                  - Reusable UI components

/lib                   - Utility functions & services
  - nanoBanana.ts      - AI API client
  - creditSystem.ts    - Credit tracking
  - sharing.ts         - Share link generation

/types                 - TypeScript type definitions
```

## Features (Planned)

- ✅ Interior editing (floors, walls, staging)
- ✅ Exterior editing (landscaping, siding, sky)
- ✅ Furniture staging with individual items
- ✅ Object removal via masking
- ✅ Chat-to-edit interface with AI suggestions
- ✅ Multi-image listing support
- ✅ Credit-based usage tracking
- ✅ Share links for buyer access
- ✅ Undo/redo with edit history

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

3. Configure your API keys in `.env.local`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Current Status

🚧 **Project structure created with placeholder components**

All routes, components, and utilities are scaffolded with TODO comments. Ready for implementation of:
- Database integration
- Nano Banana AI API
- Canvas rendering logic
- Authentication system
- Credit tracking
- Share link functionality

## Next Steps

1. Set up database schema (Prisma/Drizzle)
2. Implement authentication
3. Configure Nano Banana AI API
4. Build canvas rendering with Fabric.js or Konva
5. Implement credit system
6. Add image upload to cloud storage

---

**Note**: This is a placeholder project structure. All components are minimal and need full implementation.
