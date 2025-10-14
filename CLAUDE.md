# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Recipes is a monorepo containing:
- **Backend**: Hono server with OpenAI integration
- **Mobile app**: React Native application
- **Frontend**: React + Vite (future consideration, not in current scope)

The app helps users find healthier alternatives to products they want to buy or have at home. It uses the Open Food Facts database for product nutritional information and OpenAI to analyze products against user dietary preferences, then generates healthier homemade recipe alternatives.

## Monorepo Structure

This project uses **Turborepo** with **pnpm workspaces**.

```
apps/
  backend/      # Hono server
  mobile/       # React Native
  frontend/     # React + Vite (future)
packages/
  shared/       # Shared types, Zod schemas, utilities
```

## Architecture

### Backend (Hono)
- **Framework**: Hono (lightweight Node.js web framework)
- **Database**: SQLite for local caching
- **AI Integration**: OpenAI via AI SDK (server-side only for security)
- **Product Data**: openfoodfacts-js SDK
- **Deployment**: Local development only

**Responsibilities:**
- Fetch product data from Open Food Facts API via openfoodfacts-js
- Cache products in SQLite (only searched products, cache invalidates weekly)
- Store anonymous user profiles (nutrition-related data: allergies, diets, age, goals, weight, etc.)
- Provide REST API for mobile app
- Use OpenAI to analyze products against user profiles
- Generate complete healthier recipe alternatives (ingredients + instructions)

### Mobile (React Native)
- **Framework**: React Native
- **Styling**: NativeWind (Tailwind-like syntax)
- **UI Components**: Custom components or gluestack-ui
- **Product Search**: Text-based search (no barcode scanning yet)

**Responsibilities:**
- User onboarding flow to collect nutrition profile (anonymous, no PII)
- Text-based product search interface
- Display product nutrition facts
- Show AI-generated health analysis and recipe alternatives
- **About screen MUST include Open Food Facts attribution** (required by license)

### Frontend (Future)
- React + Vite
- TanStack Query for data fetching
- Not in current scope

## Data Sources

- **Open Food Facts**: Product information (nutritional values, allergens, ingredients)
  - https://world.openfoodfacts.org/data
  - https://openfoodfacts.github.io/openfoodfacts-server/
  - SDK: https://github.com/openfoodfacts/openfoodfacts-js
  - **License requirement**: Must attribute Open Food Facts in the mobile app's About screen

## Key Features

1. **Anonymous User Profiles**: Collect nutrition-related information without PII
   - Dietary preferences (vegan, vegetarian, keto, etc.)
   - Allergies and restrictions
   - Age, weight, health goals
   - Keep it simple - this is a demo app

2. **Product Search & Analysis**:
   - Users search for products by text
   - Backend fetches from Open Food Facts (cached locally)
   - AI analyzes product against user profile
   - Identifies potential issues (allergies, dietary conflicts, health goals)

3. **Recipe Generation**:
   - AI generates complete healthier homemade alternatives
   - Includes full ingredient list and cooking instructions
   - No pantry management (users don't store what they have)

4. **Caching Strategy**:
   - Only cache products that users search for
   - Cache invalidates weekly to get updated product data
   - Reduces API calls and prevents rate limiting

## Technology Stack

- **Backend**: Hono, SQLite, OpenAI (via AI SDK), openfoodfacts-js
- **Mobile**: React Native, NativeWind
- **Shared**: TypeScript, Zod (validation), pnpm workspaces
- **Monorepo**: Turborepo

## Common Commands

Run these from the **root directory**:

```bash
# Development
pnpm dev              # Start dev server for all apps
pnpm dev --filter @ai-recipes/backend  # Start only backend
pnpm dev --filter @ai-recipes/mobile   # Start only mobile app

# Building
pnpm build            # Build all apps
pnpm build --filter @ai-recipes/backend  # Build only backend

# Type checking
pnpm check-types      # Type check all apps

# Linting
pnpm lint             # Lint all apps
```

## Important Notes

- **Local Development**: Everything runs locally (backend + mobile)
- **No Authentication**: Keep it simple for demo purposes
- **No PII Collection**: User profiles are anonymous
- **API Keys**: Keep OpenAI key server-side only (backend)
- **Open Food Facts Attribution**: Required in mobile app About screen
