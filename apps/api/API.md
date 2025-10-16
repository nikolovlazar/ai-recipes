# AI Recipes API Documentation

Base URL: `http://localhost:3000/api`

## Overview

The AI Recipes API provides endpoints for managing user nutrition profiles, searching products, and analyzing products against user dietary preferences using AI.

**Tech Stack:**
- Express.js server
- SQLite database (local caching)
- OpenAI integration (AI analysis - pending implementation)
- Open Food Facts API (product data)

---

## Common Response Patterns

### Success Response
```json
{
  "data": { ... }
}
```

### Error Response
```json
{
  "error": {
    "message": "Error description"
  }
}
```

### Date Serialization
All `Date` objects are automatically serialized to ISO 8601 strings by Express's JSON serializer:
- Backend types use `Date` objects
- JSON responses contain ISO 8601 date strings (e.g., `"2024-10-14T12:00:00.000Z"`)
- Mobile apps can parse these strings back to `Date` objects if needed

---

## Authentication

Currently, the API does not require authentication. It operates in **single-tenant mode** (one user profile per database).

---

## Profile Endpoints

### Get Profile
Retrieve the current user's nutrition profile.

**Endpoint:** `GET /api/profile`

**Response:**
- **200 OK** - Profile found
```json
{
  "id": 1,
  "diet": "vegan",
  "allergies": ["nuts", "dairy"],
  "restrictions": ["low-sodium"],
  "age": 28,
  "weight": 70,
  "goals": "maintain health",
  "createdAt": "2024-10-14T12:00:00.000Z",
  "updatedAt": "2024-10-14T12:00:00.000Z"
}
```

- **404 Not Found** - No profile exists
```json
{
  "error": {
    "message": "Profile not found"
  }
}
```

---

### Create Profile
Create a new user profile (onboarding flow).

**Endpoint:** `POST /api/profile`

**Request Body:** (All fields optional)
```json
{
  "diet": "vegan",
  "allergies": ["nuts", "dairy"],
  "restrictions": ["low-sodium", "low-sugar"],
  "age": 28,
  "weight": 70,
  "goals": "lose weight"
}
```

**Field Descriptions:**
- `diet` (string) - Dietary preference (e.g., "vegan", "vegetarian", "keto", "paleo")
- `allergies` (string[]) - List of allergens to avoid
- `restrictions` (string[]) - Dietary restrictions (e.g., "low-sodium", "low-sugar")
- `age` (number) - User's age in years
- `weight` (number) - User's weight in kilograms
- `goals` (string) - Health goals (e.g., "lose weight", "build muscle", "maintain health")

**Response:**
- **201 Created** - Profile created successfully
```json
{
  "id": 1,
  "diet": "vegan",
  "allergies": ["nuts", "dairy"],
  "restrictions": ["low-sodium"],
  "age": 28,
  "weight": 70,
  "goals": "lose weight",
  "createdAt": "2024-10-14T12:00:00.000Z",
  "updatedAt": "2024-10-14T12:00:00.000Z"
}
```

- **409 Conflict** - Profile already exists
```json
{
  "error": {
    "message": "Profile already exists"
  }
}
```

---

### Update Profile
Update the existing user profile.

**Endpoint:** `PUT /api/profile`

**Request Body:** (All fields optional)
```json
{
  "diet": "vegetarian",
  "allergies": ["nuts"],
  "age": 29,
  "weight": 68
}
```

**Response:**
- **200 OK** - Profile updated successfully
```json
{
  "id": 1,
  "diet": "vegetarian",
  "allergies": ["nuts"],
  "restrictions": ["low-sodium"],
  "age": 29,
  "weight": 68,
  "goals": "lose weight",
  "createdAt": "2024-10-14T12:00:00.000Z",
  "updatedAt": "2024-10-15T10:00:00.000Z"
}
```

- **404 Not Found** - Profile doesn't exist
```json
{
  "error": {
    "message": "Profile not found"
  }
}
```

---

### Delete Profile
Delete the user profile.

**Endpoint:** `DELETE /api/profile`

**Response:**
- **204 No Content** - Profile deleted successfully (empty response body)

- **404 Not Found** - Profile doesn't exist
```json
{
  "error": {
    "message": "Profile not found"
  }
}
```

---

## Product Endpoints

### Search Products
Search for products by name or text query.

**Endpoint:** `GET /api/products/search`

**Query Parameters:**
- `q` (required, string) - Search query
- `page` (optional, number) - Page number for pagination (default: 1)

**Example Request:**
```
GET /api/products/search?q=nutella&page=1
```

**Response:**
- **200 OK** - Search results
```json
{
  "products": [
    {
      "barcode": "3017620422003",
      "name": "Nutella",
      "brands": ["Ferrero"],
      "image_url": "https://images.openfoodfacts.org/images/products/301/762/042/2003/front_en.jpg",
      "nutriscore_grade": "e"
    }
  ],
  "count": 24,
  "page": 1
}
```

- **400 Bad Request** - Missing or invalid query parameter
```json
{
  "error": {
    "message": "Search query 'q' is required"
  }
}
```

---

### Get Product Details
Get detailed information about a specific product by barcode.

**Endpoint:** `GET /api/products/:barcode`

**Path Parameters:**
- `barcode` (string) - Product barcode (EAN-13 or similar)

**Example Request:**
```
GET /api/products/3017620422003
```

**Response:**
- **200 OK** - Product details
```json
{
  "barcode": "3017620422003",
  "name": "Nutella",
  "brands": "Ferrero",
  "categories": "Spreads, Sweet spreads, Hazelnut spreads, Chocolate spreads",
  "categories_tags": ["en:spreads", "en:sweet-spreads"],
  "image_url": "https://images.openfoodfacts.org/images/products/301/762/042/2003/front_en.jpg",
  "ingredients_text": "Sugar, Palm Oil, Hazelnuts (13%), Skimmed Milk Powder (8.7%), Fat-Reduced Cocoa (7.4%), Emulsifier: Lecithins (Soya), Vanillin",
  "ingredients": [
    {
      "id": "en:sugar",
      "text": "Sugar",
      "percent": 56.3,
      "vegan": "yes",
      "vegetarian": "yes"
    }
  ],
  "allergens": "Milk, Nuts, Soybeans",
  "allergens_tags": ["en:milk", "en:nuts", "en:soybeans"],
  "nutriscore_grade": "e",
  "nova_group": 4,
  "ecoscore_grade": "d",
  "nutrient_levels": {
    "fat": "high",
    "saturated-fat": "high",
    "sugars": "high",
    "salt": "low"
  },
  "nutriments": {
    "energy-kcal_100g": 539,
    "fat_100g": 30.9,
    "saturated-fat_100g": 10.6,
    "carbohydrates_100g": 57.5,
    "sugars_100g": 56.3,
    "fiber_100g": 0,
    "proteins_100g": 6.3,
    "salt_100g": 0.107
  },
  "quantity": "750g",
  "serving_size": "15g",
  "cached": true,
  "cached_at": "2024-10-14T12:00:00.000Z"
}
```

- **404 Not Found** - Product not found in Open Food Facts database
```json
{
  "error": {
    "message": "Product not found"
  }
}
```

- **400 Bad Request** - Invalid barcode format
```json
{
  "error": {
    "message": "Invalid barcode format"
  }
}
```

**Notes:**
- Products are cached locally for 7 days to reduce API calls
- `cached` and `cached_at` indicate if the product was served from cache
- `brands` can be a string or array depending on the data source

---

### Analyze Product
Analyze a product against the user's dietary profile using AI.

**Endpoint:** `GET /api/products/:barcode/analyze`

**Path Parameters:**
- `barcode` (string) - Product barcode

**Example Request:**
```
GET /api/products/3017620422003/analyze
```

**Response:**
- **200 OK** - Analysis result (AI integration pending)

Current implementation returns prepared data:
```json
{
  "message": "Data prepared for LLM. AI analysis not yet implemented.",
  "llm_input": {
    "user_profile": {
      "diet": "vegan",
      "allergies": ["nuts"],
      "restrictions": ["low-sugar"],
      "age": 28,
      "weight": 70,
      "goals": "maintain health"
    },
    "product": {
      "name": "Nutella",
      "brands": "Ferrero",
      "allergens": ["milk", "nuts", "soybeans"],
      "nutriscore": "e",
      "nova_group": 4,
      "nutrient_levels": {
        "fat": "high",
        "saturated-fat": "high",
        "sugars": "high",
        "salt": "low"
      },
      "nutrition_per_100g": {
        "energy_kcal": 539,
        "fat": 30.9,
        "saturated_fat": 10.6,
        "carbs": 57.5,
        "sugars": 56.3,
        "protein": 6.3,
        "salt": 0.107,
        "fiber": 0
      },
      "ingredients": [
        {
          "name": "sugar",
          "percent": 56.3,
          "vegan": "yes",
          "vegetarian": "yes"
        }
      ]
    }
  }
}
```

**Future Response (once AI integration is complete):**
```json
{
  "isSafe": false,
  "issues": [
    "Contains nuts (allergen)",
    "Contains dairy products (not vegan)",
    "Very high in sugar (56.3g per 100g)",
    "High in saturated fat"
  ],
  "recommendation": "This product is not suitable for your dietary preferences. It contains nuts and dairy, which conflict with your vegan diet and allergen restrictions. Additionally, it's extremely high in sugar, which doesn't align with your low-sugar restriction.",
  "recipe": {
    "name": "Homemade Vegan Chocolate Spread",
    "ingredients": [
      "200g hazelnuts (or sunflower seeds if nut-free)",
      "3 tbsp cocoa powder",
      "2 tbsp maple syrup",
      "2 tbsp coconut oil",
      "1 tsp vanilla extract",
      "Pinch of salt"
    ],
    "instructions": [
      "Roast hazelnuts at 350°F (175°C) for 10-12 minutes until fragrant",
      "Let cool, then remove skins by rubbing in a towel",
      "Blend hazelnuts in a food processor until smooth and buttery (10-15 minutes)",
      "Add cocoa powder, maple syrup, coconut oil, vanilla, and salt",
      "Blend until completely smooth",
      "Store in an airtight container at room temperature for up to 2 weeks"
    ]
  }
}
```

- **400 Bad Request** - Profile not found (user must create profile first)
```json
{
  "error": {
    "message": "Profile not found. Please create a profile before analyzing products."
  }
}
```

- **404 Not Found** - Product not found
```json
{
  "error": {
    "message": "Product not found"
  }
}
```

**Notes:**
- **AI Integration Status:** The endpoint currently returns prepared data. OpenAI integration is pending implementation.
- Users must have a profile before analyzing products
- The AI will check for allergen conflicts, dietary restrictions, and health goals
- If the product is unsuitable, a healthier homemade recipe alternative will be generated
- **Streaming:** The final implementation may stream the AI response in real-time using Server-Sent Events (SSE)

---

## Data Models

### Profile Schema
```typescript
{
  id: number;
  diet?: string | null;
  allergies?: string[] | null;
  restrictions?: string[] | null;
  age?: number | null;
  weight?: number | null;
  goals?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Product Search Result Schema
```typescript
{
  barcode: string;
  name: string;
  brands?: string[];
  image_url?: string;
  nutriscore_grade?: string;
}
```

### Product Details Schema
```typescript
{
  barcode: string;
  name: string;
  brands?: string | string[];
  categories?: string;
  categories_tags?: string[];
  image_url?: string;
  ingredients_text?: string;
  ingredients?: Array<{
    id?: string;
    text?: string;
    percent?: number;
    vegan?: "yes" | "no" | "maybe";
    vegetarian?: "yes" | "no" | "maybe";
  }>;
  allergens?: string;
  allergens_tags?: string[];
  traces?: string;
  traces_tags?: string[];
  nutriscore_grade?: string; // a-e (a=best, e=worst)
  nova_group?: number; // 1-4 (1=unprocessed, 4=ultra-processed)
  ecoscore_grade?: string; // a-e (environmental score)
  nutrient_levels?: {
    fat?: "low" | "moderate" | "high";
    salt?: "low" | "moderate" | "high";
    "saturated-fat"?: "low" | "moderate" | "high";
    sugars?: "low" | "moderate" | "high";
  };
  nutriments?: {
    "energy-kcal_100g"?: number;
    fat_100g?: number;
    "saturated-fat_100g"?: number;
    carbohydrates_100g?: number;
    sugars_100g?: number;
    fiber_100g?: number;
    proteins_100g?: number;
    salt_100g?: number;
    sodium_100g?: number;
  };
  quantity?: string;
  serving_size?: string;
  cached?: boolean;
  cached_at?: Date;
}
```

### Analysis Response Schema (Future)
```typescript
{
  isSafe: boolean;
  issues?: string[];
  recommendation: string;
  recipe?: {
    name: string;
    ingredients: string[];
    instructions: string[];
  };
}
```

---

## Status Codes Summary

| Status Code | Meaning |
|-------------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request succeeded with no response body |
| 400 | Bad Request - Invalid request parameters or missing required fields |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error (check logs) |

---

## Error Handling

All errors follow a consistent format:
```json
{
  "error": {
    "message": "Human-readable error description"
  }
}
```

Common error scenarios:
- Missing required query parameters (400)
- Invalid data format (400)
- Resource not found (404)
- Attempting to create a resource that already exists (409)
- Server errors (500)

---

## Caching Strategy

### Products Cache
- Products fetched from Open Food Facts are cached in SQLite
- Cache duration: **7 days**
- After 7 days, products are automatically refetched from Open Food Facts
- Only searched products are cached (no bulk caching)

### Why Caching?
- Reduces API calls to Open Food Facts
- Prevents rate limiting
- Improves response times for frequently searched products
- Provides offline functionality for recently viewed products

---

## Open Food Facts Attribution

This API uses data from [Open Food Facts](https://world.openfoodfacts.org/), an open database of food products from around the world.

**License:** [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/1.0/)

**Required Attribution:** Mobile applications using this API must include attribution to Open Food Facts in their About screen.

---

## Development Notes

### Running the Server
```bash
# From project root
pnpm dev --filter @ai-recipes/api

# Or directly in apps/api
cd apps/api
pnpm dev
```

### Database Location
SQLite database: `apps/api/data/ai-recipes.db`

### Environment Variables
Create a `.env` file in `apps/api`:
```env
PORT=3000
DATABASE_PATH=./data/ai-recipes.db
OPENAI_API_KEY=your_openai_api_key_here
```

---

## Roadmap

### Pending Implementation
- [ ] OpenAI integration for product analysis
- [ ] Streaming responses (SSE) for AI analysis
- [ ] Rate limiting
- [ ] Request validation middleware (Zod schemas)
- [ ] Enhanced error logging

### Future Considerations
- [ ] Multi-user support (authentication)
- [ ] Barcode scanning (mobile app)
- [ ] Recipe favorites/history
- [ ] Meal planning features
