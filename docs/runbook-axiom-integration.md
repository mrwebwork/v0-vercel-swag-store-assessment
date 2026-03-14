# Axiom Integration Runbook

## Overview

This document outlines the deployment and validation process for the Axiom observability integration in the Vercel Swag Store.

## Integration Components

### 1. next-axiom Configuration

**File:** `next.config.ts`

```typescript
import { withAxiom } from 'next-axiom'

export default withAxiom(nextConfig)
```

**Status:** Active and verified. The `withAxiom` wrapper enables automatic log capture from server-side code.

### 2. AxiomWebVitals Component

**File:** `app/layout.tsx`

```typescript
import { AxiomWebVitals } from 'next-axiom'

// In the body element:
<AxiomWebVitals />
```

**Purpose:** Automatically reports Core Web Vitals (LCP, FID, CLS, INP, TTFB) to Axiom for real-user monitoring.

### 3. Structured Logging Schema

**File:** `lib/logger.ts`

**Schema Version:** 2.0.0

**Log Categories:**
| Category | Description | Example Events |
|----------|-------------|----------------|
| `api_request` | Successful API calls | Product fetch, stock check |
| `api_error` | Failed API calls | Network errors, 4xx/5xx responses |
| `cart_lifecycle` | Cart operations | Create, read, add, update, remove |
| `cache_event` | Cache invalidation | Tag revalidation |
| `page_view` | Server-side renders | Product page, home page |
| `user_action` | User interactions | Add to cart, search |
| `system_event` | System events | Config changes |

## Deployment Steps

### Pre-Deployment Checklist

- [ ] Verify `AXIOM_TOKEN` environment variable is set in Vercel project settings
- [ ] Verify `AXIOM_DATASET` environment variable is set (defaults to `vercel`)
- [ ] Confirm `next-axiom@^1.10.0` is in dependencies
- [ ] Run `pnpm build` locally to verify no compilation errors

### Deployment Process

1. **Merge to main branch** or deploy preview branch
2. **Monitor Vercel deployment logs** for successful build
3. **Verify deployment** in Vercel dashboard

### Post-Deployment Validation

#### 1. Verify Web Vitals Reporting

1. Open the deployed application
2. Navigate through several pages
3. Check Axiom dashboard for `web-vital` events
4. Expected fields:
   - `name` (LCP, FID, CLS, INP, TTFB)
   - `value` (metric value)
   - `path` (page route)

#### 2. Verify API Logging

1. Trigger API calls (load products, add to cart)
2. Check Axiom dashboard for `api_request` events
3. Verify schema fields:
   - `level`, `service`, `category`
   - `method`, `path`, `endpoint`
   - `durationMs`, `status`, `success`
   - `environment`, `region`

#### 3. Verify Cart Lifecycle Logging

1. Create a new cart (add first item)
2. Update cart quantity
3. Remove cart item
4. Check Axiom for `cart_lifecycle` events with `cartAction` field

## Axiom Dashboard Queries

### Web Vitals Performance

```apl
['vercel']
| where ['_sysTime'] >= ago(24h)
| where ['name'] in ('LCP', 'FID', 'CLS', 'INP', 'TTFB')
| summarize avg(value), p95(value) by bin_auto(_time), name
```

### API Error Rate

```apl
['vercel']
| where ['_sysTime'] >= ago(1h)
| where category == 'api_request' or category == 'api_error'
| summarize 
    total = count(),
    errors = countif(success == false)
  by bin(5m, _time)
| extend error_rate = (errors * 100.0) / total
```

### Cart Funnel Analysis

```apl
['vercel']
| where category == 'cart_lifecycle'
| summarize count() by cartAction, bin(1h, _time)
```

### Slow API Endpoints

```apl
['vercel']
| where category == 'api_request'
| where durationMs > 500
| summarize count(), avg(durationMs), p95(durationMs) by endpoint
| order by count() desc
```

## Troubleshooting

### No logs appearing in Axiom

1. Verify `AXIOM_TOKEN` is set correctly
2. Check Vercel function logs for connection errors
3. Ensure `withAxiom` wrapper is applied in `next.config.ts`

### Missing Web Vitals

1. Verify `<AxiomWebVitals />` is in `app/layout.tsx`
2. Check browser console for errors
3. Web Vitals only report after user interaction (LCP, FID)

### Incomplete log schema

1. Verify all `emitLog()` calls include required fields
2. Check for TypeScript errors in `lib/logger.ts`
3. Review structured logging documentation

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AXIOM_TOKEN` | Yes | API token for Axiom ingestion |
| `AXIOM_DATASET` | No | Dataset name (defaults to `vercel`) |
| `VERCEL_ENV` | Auto | Injected by Vercel (production/preview/development) |
| `VERCEL_REGION` | Auto | Injected by Vercel (deployment region) |

## Contacts

- **Axiom Documentation:** https://axiom.co/docs
- **next-axiom Package:** https://github.com/axiomhq/next-axiom
- **Vercel Support:** https://vercel.com/help

---

*Last Updated: 2026-03-13*
*Schema Version: 2.0.0*
