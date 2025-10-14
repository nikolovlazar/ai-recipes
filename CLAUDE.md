# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Recipes is a monorepo containing:
- **Backend**: Express server with OpenAI integration
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

### Backend (Express)
- **Framework**: Express (Node.js web framework)
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

## Backend Architecture Principles

The backend follows **Clean Architecture** principles for maintainability and testability:

### Layer Structure

```
src/
├── routes/          # HTTP layer - thin controllers
├── use-cases/       # Business logic - pure TypeScript functions
├── repositories/    # Data access layer
└── types/           # Domain models and DTOs
```

### Key Rules

1. **Routes** - Only handle HTTP concerns (parsing requests, sending responses)
   - Parse request body/params
   - Call use cases
   - Format HTTP responses
   - Handle HTTP errors
   - NO business logic here

2. **Use Cases** - Pure business logic functions
   - Accept repositories as dependencies (dependency injection)
   - Contain all business rules and validation
   - Return domain objects or throw domain errors
   - NO framework imports (no Express, no Drizzle, no external SDKs)
   - Easily testable without mocks

3. **Repositories** - Data access layer
   - `profile.repository.ts` - Local SQLite database operations (uses Drizzle)
   - `products.repository.ts` - Open Food Facts SDK + local cache layer
   - All external data sources abstracted here
   - Return domain objects, not raw database records

4. **Types** - Domain models and DTOs
   - DTOs for request/response data
   - Domain models for business logic
   - Clear contracts between layers

### Dependency Rule

- Routes depend on Use Cases and Repositories
- Use Cases depend on Repositories (via interfaces/types)
- Repositories depend on external libraries (Drizzle, SDKs)
- **Inner layers never import outer layers**

### Example Flow

```
HTTP Request → Route → Use Case → Repository → Database/API
   (Express)     ↓        ↓           ↓
              Parse    Business    Data Access
                       Logic
```

### Benefits

- **Testability**: Use cases are pure functions, easy to unit test
- **Maintainability**: Clear separation of concerns
- **Flexibility**: Can swap implementations (e.g., change database)
- **Reusability**: Business logic can be used from different interfaces

## Technology Stack

- **Backend**: Express, SQLite, OpenAI (via AI SDK), openfoodfacts-js
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

## API Endpoints

### Profile Management
- `GET /api/profile` - Get the current user profile
- `POST /api/profile` - Create user profile (onboarding)
- `PUT /api/profile` - Update user profile
- `DELETE /api/profile` - Delete user profile

**Profile Schema:**
```typescript
{
  diet?: string;              // e.g., "vegan", "vegetarian", "keto", "paleo"
  allergies?: string[];       // e.g., ["nuts", "dairy", "gluten"]
  restrictions?: string[];    // e.g., ["low-sodium", "low-sugar"]
  age?: number;
  weight?: number;            // in kg
  goals?: string;             // e.g., "lose weight", "build muscle", "maintain health"
}
```

### Product Search
- `GET /api/products/search?q={query}` - Search for products by name
  - Returns list of products from Open Food Facts
  - Results are cached in SQLite for future requests

### Product Analysis
- `POST /api/products/{barcode}/analyze` - Analyze a product for the current user
  - Sends product details + user profile to OpenAI
  - Streams AI response in real-time (SSE/streaming response)
  - AI checks if product is safe for user consumption
  - If unsafe or unhealthy, generates healthier homemade recipe alternative with full instructions

**Analysis Response Format:**
```typescript
{
  isSafe: boolean;
  issues?: string[];          // e.g., ["Contains nuts", "High in sugar"]
  recommendation: string;     // AI-generated analysis
  recipe?: {
    name: string;
    ingredients: string[];
    instructions: string[];
  }
}
```

## Database Schema

### Users Table (Single Tenant)
```sql
CREATE TABLE user (
  id INTEGER PRIMARY KEY,
  diet TEXT,
  allergies TEXT,           -- JSON array
  restrictions TEXT,        -- JSON array
  age INTEGER,
  weight REAL,
  goals TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Products Cache Table
```sql
CREATE TABLE products (
  barcode TEXT PRIMARY KEY,
  name TEXT,
  data TEXT,               -- Full JSON data from Open Food Facts
  cached_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Important Notes

- **Single Tenant**: Database stores data for only one user
- **Local Development**: Everything runs locally (backend + mobile)
- **No Authentication**: Keep it simple for demo purposes
- **No PII Collection**: User profiles are anonymous
- **API Keys**: Keep OpenAI key server-side only (backend)
- **Streaming**: Product analysis streams AI response in real-time
- **Cache Invalidation**: Products cached for 7 days, then refetched from Open Food Facts
- **Open Food Facts Attribution**: Required in mobile app About screen
