---
title: "Context Engineering Toolkit"
description: "A systematic framework for designing, testing, and optimizing the information that language models receive — covering chunking strategies, context window budgeting, prompt templates, and retrieval evaluation."
pubDate: "2025-08-20"
heroImage: "https://picsum.photos/seed/ctxeng/1200/630"
tags:
  - "Context Engineering"
  - "LLM"
  - "Prompt Engineering"
  - "Python"
  - "TypeScript"
  - "Evaluation"
  - "LangChain"
  - "RAG"
repoUrl: "https://github.com/fysp11/fysp11.github.io"
liveUrl: "/projects/context"
# active: false
menuLabel: "context"
---

Context engineering is the practice of deliberately designing what a language model sees — not just a prompt, but the entire information environment: retrieved chunks, system instructions, memory summaries, tool outputs, and conversation history. Getting this right is the difference between an LLM that reasons correctly and one that confidently hallucinates.

This toolkit provides a reproducible framework for context design and evaluation.

## Core Modules

### 1. Chunking Strategy Lab
Compare chunking approaches on your own documents:
- Fixed-size, sentence-boundary, semantic (embedding-based), and recursive chunking
- Metrics: retrieval recall, context coherence, LLM answer quality
- Visual diff of what each strategy surfaces for the same query

### 2. Context Window Budgeter
LLMs have finite context windows — every token is a budget decision:
- Priority-based slot allocation: system prompt → retrieved context → conversation history → output space
- Token counting across providers (OpenAI, Anthropic, open-source)
- Automatic truncation strategies that preserve the most relevant context

### 3. Prompt Template System
Structured, typed prompt templates that separate concerns:
- Instruction layer (what to do)
- Context layer (what to know)
- Constraint layer (what not to do)
- Output format layer (how to respond)
- Versioned templates with A/B evaluation support

### 4. Retrieval Evaluator
Measure what actually matters:
- Context precision (are retrieved chunks relevant to the query?)
- Context recall (are all relevant chunks being retrieved?)
- Answer faithfulness (does the LLM response stay within the provided context?)
- Answer relevance (does the response address the actual question?)

## Why This Matters

Most RAG failures aren't model failures — they're context failures. The model is reasoning correctly over the wrong information. This toolkit makes context design a first-class engineering practice rather than trial-and-error prompt tweaking.

## Stack

- **Python**: Core evaluation and chunking logic
- **TypeScript**: Browser-based prompt template editor
- **RAGAS**: Evaluation metrics framework
- **LangChain**: Pipeline composition
- **Rich / Typer**: CLI interface
