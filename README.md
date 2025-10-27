# AI Recipes

A monorepo containing the web app, and mobile app (React Native) for the AI Recipes application.

## Overview

AI Recipes helps users generate personalized recipes from the products they have at home. The app leverages the [Open Food Facts](https://world.openfoodfacts.org/) database to fetch detailed product information and uses AI to create recipes that consider:

- Product nutritional values
- Allergens and dietary restrictions
- User's dietary preferences
- Available ingredients

## Attribution

This project uses data from [Open Food Facts](https://world.openfoodfacts.org/data), a free, open database of food products from around the world.

## Getting this project running

- `pnpm install` to install all the dependencies
- `cd apps/api && pnpm db:push` to create the `local.db` database file and apply the schema
- `cp apps/api/.env.example apps/api/.env` to copy the environment variables file
- go to `apps/api/.env` and paste your Anthropic API key
- go to `apps/api/src/instrument.ts` and replace your Sentry DSN key
- go to `apps/mobile/app/_layout.tsx` and replace your Sentry DSN key
- `pnpm dev` to boot up both the backend and the mobile app
