# Personal Website

This is a personal website built with [Astro](https://astro.build/), [React](https://react.dev/), and [Tailwind CSS](https://tailwindcss.com/).

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:4321](http://localhost:4321) with your browser to see the result.

## ✨ Features

### 🤖 AI Story & Image Generator

This project includes an interactive page that leverages Google's Gemini models to generate creative stories and images from a single user prompt.

- **Story Generation**: Uses `gemini-1.5-flash-latest` for fast and creative text.
- **Image Generation**: Uses a specialized Gemini model for high-quality image synthesis.
- **Integration**: Powered by the Vercel AI SDK for seamless communication with the AI models.

## ⚙️ Environment Variables

To run the project locally, you'll need to set up the following environment variables. Create a `.env` file in the root of the project and add the following:

```dotenv
# Google Analytics (Optional)
PUBLIC_GA_ID="G-XXXXXXXXXX"

# HubSpot (Optional)
PUBLIC_HS_ID="XXXXXXXX"

# Google Gemini (Required for AI features)
GOOGLE_GENERATIVE_AI_API_KEY="YOUR_GEMINI_API_KEY"
AI_GATEWAY_API_KEY="YOUR_GATEWAY_API_KEY"
```

You can get your `GOOGLE_GENERATIVE_AI_API_KEY` from [Google AI Studio](https://aistudio.google.com/).

## Available Scripts

- `pnpm run dev`: Runs the app in the development mode.
- `pnpm run start`: Starts the app in production mode.
- `pnpm run build`: Builds the app for production to the `dist` folder.
- `pnpm run preview`: Serves the production build locally for preview.
- `pnpm run lint`: Lints the code using ESLint.
- `pnpm run format`: Formats the code using Prettier.
- `pnpm run type-check`: Checks for TypeScript errors.

## Technologies Used

- [Astro](https://astro.build/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
