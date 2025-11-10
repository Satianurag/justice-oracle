# Justice Oracle - Frontend

**Built with Next.js 15 + React 18 + shadcn/ui + TailwindCSS**

Modern, beautiful frontend for the Justice Oracle AI-powered dispute resolution platform on GenLayer.

## 🎨 Features

- ✅ **File Dispute** - Submit disputes with case descriptions and evidence URLs
- ✅ **Evidence Submission** - Add evidence with AI credibility scoring
- ✅ **Dispute Browser** - View all disputes with status and verdicts
- ✅ **AI Verdict Display** - Show complete reasoning, confidence scores, and distributions
- ✅ **Stats Dashboard** - Platform metrics and analytics
- ✅ **Responsive Design** - Works on mobile, tablet, and desktop
- ✅ **Dark Mode** - Full dark mode support

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 18
- **Styling**: TailwindCSS v4
- **Components**: shadcn/ui (following global rules)
- **Icons**: Lucide React
- **Blockchain**: GenLayer JS SDK
- **TypeScript**: Full type safety

## 📁 Project Structure

```
frontend/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── justice-oracle-app.tsx
│   ├── file-dispute-form.tsx
│   ├── dispute-list.tsx
│   ├── submit-evidence-form.tsx
│   ├── dispute-details-dialog.tsx
│   └── stats-display.tsx
└── lib/
    └── utils.ts             # Utility functions
```

## 🎯 Components

### Main Components
- **JusticeOracleApp** - Main application layout with tabs
- **FileDisputeForm** - Form to file new disputes
- **DisputeList** - Browse and filter disputes
- **SubmitEvidenceForm** - Submit evidence with AI scoring
- **DisputeDetailsDialog** - Full dispute details with AI reasoning
- **StatsDisplay** - Platform statistics

### UI Components (shadcn/ui)
- Button, Card, Input, Label, Textarea
- Badge, Tabs, Dialog, Alert, Form
- Select, Separator, ScrollArea

## 🔌 Connecting to Smart Contract

Currently uses mock data. To connect to actual GenLayer contract:

1. Install GenLayer JS SDK (already done)
2. Update contract address in a config file
3. Replace mock data calls with real contract calls:

```typescript
// Example:
import { createClient } from 'genlayer-js'

const client = createClient({
  contractAddress: 'YOUR_CONTRACT_ADDRESS'
})

// Replace mock calls
const disputes = await client.read('get_all_disputes', [])
const dispute = await client.read('get_dispute', [disputeId])
await client.write('file_dispute', [defendant, description, urls])
```

## 🎨 Design System

**Colors:**
- Primary: Indigo/Purple gradient
- Success: Green
- Warning: Yellow/Orange
- Error: Red

**Typography:**
- Headings: Bold, gradient text
- Body: Default sans-serif
- Code: Monospace font

**Components:**
- All UI components follow shadcn/ui patterns
- Consistent spacing with TailwindCSS
- Smooth animations and transitions

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🌓 Dark Mode

Automatic dark mode support via Next.js themes.
Toggle in system preferences or add manual toggle.

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build command
npm run build

# Output directory
out/
```

## 📝 Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_GENLAYER_RPC=https://...
```

## 🎬 Demo

1. Navigate to "File Dispute" tab
2. Fill in defendant address, case description, evidence URLs
3. Submit dispute (simulated)
4. Go to "Disputes" tab to see filed dispute
5. Click "View Details" to see full information
6. Submit evidence in "Evidence" tab
7. View AI credibility scores

## 🏆 Hackathon Ready

- ✅ Production-quality code
- ✅ Beautiful UI/UX
- ✅ Fully responsive
- ✅ Type-safe TypeScript
- ✅ shadcn/ui components (following rules)
- ✅ Ready for live demo

## 📄 License

MIT License - Built for GenLayer Hackathon Nov 2024
