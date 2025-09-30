# Personal Website & Portfolio

[![semantic-release](https://img.shields.io/badge/semantic--release-24.2.9-blue)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This is the repository for my personal website and portfolio, showcasing my projects, skills, and professional journey. Built with modern web technologies, it features a clean design, interactive elements, and AI-powered content generation.

**Live Demo:** [fysp.eth.limo](https://fysp.eth.limo)

---

## ✨ Features

- **Modern Tech Stack**: Built with [Astro](https://astro.build/) for performance, [React](https://react.dev/) for interactivity, and [Tailwind CSS](https://tailwindcss.com/) for styling.
- **Interactive 3D Scenes**: Engaging visuals created with [Three.js](https://threejs.org/) and `@react-three/fiber`.
- **AI Story & Image Generator**: An interactive page that leverages Google's Gemini models to generate creative stories and images from user prompts.
- **Fully Responsive**: Designed to work seamlessly on all devices, from desktops to mobile phones.
- **CI/CD**: Automated build, test, and deployment pipeline using GitHub Actions.

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **3D Graphics**: [Three.js](https://threejs.org/), `@react-three/fiber`, `@react-three/drei`
- **AI**: [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- **Linting & Formatting**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v22.x)
- [pnpm](https://pnpm.io/) (v10.x)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/fysp11/fysp11.github.io.git
    cd fysp11.github.io
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

### Environment Variables

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

### Running the Development Server

```bash
pnpm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser to see the result.

## 🚢 Deployment

This project is configured for automatic deployment to [Cloudflare Pages](https://pages.cloudflare.com/) and [GitHub Pages](https://pages.github.com/). Any push to the `main` branch will trigger a new deployment.

## 🤝 Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
