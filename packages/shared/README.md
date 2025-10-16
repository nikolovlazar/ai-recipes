# @ai-recipes/shared

Shared TypeScript types for the AI Recipes monorepo.

## Purpose

This package provides type definitions that are shared between the API and mobile app, ensuring type safety and a consistent contract across the codebase.

## Usage

### In Mobile App

```typescript
import type {
  ProfileDto,
  ProfileResponse,
  ProductSearchResult,
  ProductDetails,
  AnalysisResponse,
  Recipe,
  ApiError,
} from '@ai-recipes/shared';
```

### In Backend

The backend primarily uses these types for API responses. For internal data processing, the backend uses:
- Its own domain types (`src/types/*.types.ts`)
- Raw Open Food Facts types from the `openfoodfacts-js` SDK

## Type Organization

### API Contract Types (`src/types/index.ts`)

These are the **public API contract** - what the API returns to clients:

#### Profile Types
- `ProfileDto` - Request body for creating/updating profiles
- `ProfileResponse` - Profile data returned by API

#### Product Types
- `ProductSearchResult` - Simplified product in search results
- `SearchProductsResponse` - Search results with pagination
- `ProductDetails` - Complete product information
- `ProductIngredient` - Ingredient breakdown
- `NutrientLevels` - Nutrient level classifications
- `NutritionPer100g` - Nutritional values per 100g

#### Analysis Types
- `AnalysisResponse` - AI analysis result
- `Recipe` - Recipe recommendation

#### Error Types
- `ApiError` - Standard error response format

### Internal Types (`src/types/open-food-facts.ts`)

**Note:** These are for backend internal use only.

Contains comprehensive Open Food Facts database types based on the raw API data. Mobile app should **not** import these - they're too large and contain fields not exposed by our API.

## Type Safety Benefits

1. **Compile-time validation** - Catch API contract mismatches before runtime
2. **Autocomplete** - IDE support for API request/response shapes
3. **Documentation** - Types serve as living documentation
4. **Refactoring safety** - Changes to API contract are caught across the codebase

## Development

```bash
# Type check
pnpm check-types
```

## Notes

- **Date Handling**: Types use `Date` objects, which Express automatically serializes to ISO 8601 strings in JSON responses
  - Backend: Works with `Date` objects internally
  - JSON API: Dates are serialized as ISO 8601 strings (e.g., `"2024-10-14T12:00:00.000Z"`)
  - Mobile App: Parse date strings to `Date` objects when needed
- All fields are optional unless explicitly marked required
- The API may return `null` for optional database fields
