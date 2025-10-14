# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Recipes is a monorepo containing:
- **Web app**: TanStack Start application
- **Mobile app**: React Native application

The app helps users generate personalized recipes from products they have at home, using the Open Food Facts database for product information and AI to create recipes considering nutritional values, allergens, and dietary preferences.

## Monorepo Structure

This project uses **Turborepo** with **pnpm workspaces**.

```
apps/
  web/          # TanStack Start
  mobile/       # React Native
packages/
  shared/       # Shared types, Zod schemas, utilities
```

## Styling Architecture

**Web (TanStack Start):**
- Tailwind CSS v4 (CSS-based configuration)
- shadcn/ui components

**Mobile (React Native):**
- NativeWind (Tailwind-like syntax for React Native)
- Custom components or gluestack-ui

**Important**: Design tokens are NOT shared between web and mobile due to incompatibility between Tailwind v4's CSS-based config and NativeWind's JavaScript-based config. Each app manages its own styling independently.

## Data Sources

- **Open Food Facts**: Used for product information (nutritional values, allergens, ingredients)
  - https://world.openfoodfacts.org/data
  - https://openfoodfacts.github.io/openfoodfacts-server/

## Common Commands

Run these from the **root directory**:

```bash
# Development
pnpm dev              # Start dev server for all apps
pnpm dev --filter @ai-recipes/web    # Start only web app

# Building
pnpm build            # Build all apps
pnpm build --filter @ai-recipes/web  # Build only web app

# Type checking
pnpm check-types      # Type check all apps

# Linting
pnpm lint             # Lint all apps
```

### Web App Specifics

The TanStack Start app builds to `dist/` with the following structure:
- `dist/client/` - Client-side assets (JS, CSS, images)
- `dist/server/` - Server-side code
