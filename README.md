# Vercel Swag Store

An ecommerce storefront built with Next.js 16, React 19, and TypeScript 5.7 leveraging the latest App Router functionaility and best practices.

> **Live Demo:** [vercel-merch.auradev.ai](https://vercel-merch.auradev.ai)

## Getting Started

### Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **UI:** React 19.2.4, Tailwind CSS 4.2.0, shadcn/ui
- **Language:** TypeScript 5.7.3
- **Observability:** Axiom + Vercel Analytics

#### 1. Prerequisites

- Node.js 22+
- pnpm (`npm install -g pnpm`)


#### 2. Local Development

Clone the repository and start the development server:

```bash
git clone https://github.com/mrwebwork/v0-vercel-swag-store-assessment.git
cd v0-vercel-swag-store-assessment

pnpm install
pnpm dev
```

### Scripts

  - `pnpm dev`: Starts the dev server with Turbopack
  - `pnpm build`: Creates a optimized production build
  - `pnpm start`: Starts the production server
  - `pnpm lint`: Runs ESLint

### Project Structure

```bash
├── app/                      
│   ├── cart/                 
│   ├── products/[slug]/    
│   ├── search/
│   ├── layout.tsx   
│   ├── not-found.tsx            
│   └── page.tsx              
├── components/            
├── context/                   
├── lib/                      
└── types/
├── next.config.ts     
└── tsconfig.json
```
