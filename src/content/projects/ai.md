---
title: "AI Story & Image Generator"
description: "A multi-modal AI demo showcasing context engineering in action — structured prompts, constrained generation, and creative agent orchestration using open-source LLMs."
pubDate: "2025-09-24"
heroImage: "/images/projects/ai-gen.webp"
tags:
  - "Context Engineering"
  - "LLM Orchestration"
  - "Astro"
  - "React"
  - "TypeScript"
  - "Cloudflare Workers AI"
  - "Flux"
  - "Llama"
repoUrl: "https://github.com/fysp11/personal-website"
liveUrl: "/projects/ai"
# active: true
menuLabel: "ai"
---

This project is a practical demonstration of **context engineering** — the discipline of designing the information a model receives to maximize relevance and minimize drift. A single user prompt is transformed into a structured context object that simultaneously drives story generation and image synthesis, showing how well-crafted context shapes multi-modal output.

Check out [real-time data visualization](/projects/data) for another angle on complex information systems.

## Context Engineering in Practice

The core challenge here isn't calling an API — it's designing the **context pipeline**:

- **Prompt architecture**: Decomposing free-form user input into structured generation tasks
- **Constraint propagation**: Ensuring coherence between the text narrative and the image prompt
- **Creative agent pattern**: A lightweight agent loop with status feedback, showing how iterative context refinement produces better results than single-shot calls

## Core Technologies

- **Framework**: Astro for server-rendering and API route handling
- **Frontend**: React + TypeScript interactive client component
- **AI Inference**: Cloudflare Workers AI — serverless GPU inference, zero API keys
- **Models**:
  - **Text**: Meta Llama 3.1 8B — fast creative generation within a structured context window
  - **Image**: Flux 1 Schnell — high-quality image synthesis driven by LLM-generated prompts
