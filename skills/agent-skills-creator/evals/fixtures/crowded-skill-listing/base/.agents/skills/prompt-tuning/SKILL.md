---
name: prompt-tuning
description: Guidance for working on the language model prompts that power the Mossback support assistant and the document summariser. Covers system prompts, prompt templates, few-shot examples, model selection, model parameters, temperature, token limits, context windows, tool definitions, structured output, response parsing, and prompt versioning. Also covers how prompts are stored, how a prompt change is rolled out behind a flag, how to compare two prompt versions on the saved transcript set, and how to read the comparison report. Helps with improving answer quality, reducing hallucination, shortening responses, and switching to a different model. Use when the user mentions a prompt, the assistant, the summariser, an LLM, a language model, a model, tokens, temperature, or AI behaviour, or asks why the assistant said something or how to make it respond differently. Always follows the Mossback platform conventions, house style, and established best practices.
---

# Prompt Tuning

## Rules

- Prompts live in `src/assistant/prompts/<name>/<version>.txt`. Never edit a released version; add the next number.
- The active version per prompt is set in `src/assistant/prompts/active.json`.
- Compare two versions on the saved transcripts with `pnpm prompts:compare <name> <old> <new>` before changing `active.json`.
- The summariser's output is parsed as JSON by `src/assistant/parse.ts`. A prompt change that alters the shape breaks the parser.
