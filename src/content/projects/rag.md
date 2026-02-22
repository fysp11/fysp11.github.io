---
title: "Food Intelligence RAG System"
description: "A production-grade Retrieval-Augmented Generation pipeline for food, recipe, and nutrition knowledge — combining hybrid vector search, reranking, and structured context assembly."
pubDate: "2025-11-10"
heroImage: "https://picsum.photos/seed/foodrag/1200/630"
tags:
  - "RAG"
  - "LangChain"
  - "LangGraph"
  - "Python"
  - "Vector Database"
  - "Food Tech"
  - "Embeddings"
  - "Reranking"
# active: false
menuLabel: "rag"
---

Food knowledge is rich, relational, and messy — exactly the kind of domain where generic LLMs hallucinate with confidence. This project builds a **RAG system specialized for food intelligence**: ingredient relationships, recipe coherence, nutritional logic, and culinary technique — all grounded in structured retrieval rather than model memorization.

## The RAG Architecture

This isn't basic vector search + LLM. The pipeline is designed for precision:

- **Hybrid retrieval**: Dense embedding search (semantic similarity) combined with sparse BM25 (keyword precision) — essential for food, where exact ingredient names matter as much as concept matching
- **Knowledge graph layer**: Ingredient-to-ingredient and ingredient-to-technique relationships encoded as a graph, enabling multi-hop reasoning ("what can replace X in recipe Y?")
- **Reranking**: Cross-encoder reranking of retrieved chunks before context assembly, reducing irrelevant noise in the LLM context window
- **Structured context assembly**: Retrieved chunks are formatted into a typed context schema before reaching the model, enforcing grounding constraints

## Why Food is a Hard RAG Domain

- **Terminology ambiguity**: "Bitter" means different things in coffee, beer, and greens — retrieval must be context-aware
- **Unit & quantity sensitivity**: Recipes fail with wrong proportions — the system validates nutritional and quantity coherence post-generation
- **Cultural variation**: The same dish has dozens of regional variants — retrieval must surface relevant variety without overwhelming context

## Stack

- **Orchestration**: LangGraph for agent-style RAG loop with self-correction
- **Embeddings**: Sentence transformers fine-tuned on food corpora
- **Vector store**: Pinecone (production) / ChromaDB (local dev)
- **Reranking**: Cohere Rerank API
- **LLM**: Llama 3 / Mistral via Cloudflare Workers AI
