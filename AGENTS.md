# AGENTS.md — MonadWishes Agent Configuration

## Registered Agent Skills

This repository is configured with Matt Pocock Agent Skills available from `~/.agents/skills/`:

### Core Workflow Skills
- `/ask-matt` — Router to select the right skill or flow
- `/grill-with-docs` — Relentless interview that updates CONTEXT.md and ADRs
- `/grill-me` — Stateless interview
- `/to-spec` — Convert context into detailed engineering spec
- `/to-tickets` — Break spec into actionable task tickets
- `/implement` — Execute task tickets test-first
- `/tdd` — Test-Driven Development slice
- `/code-review` — Standards and spec review of diffs

### Diagnostics & Architecture
- `/diagnosing-bugs` — Reproduce and fix complex bugs with regression test
- `/improve-codebase-architecture` — Audit and improve agent-readability
- `/domain-modeling` — Maintain CONTEXT.md glossary and ADRs
- `/codebase-design` — Deep-module interface and seam design

### Utility Skills
- `/prototype` — Throwaway design exploration
- `/research` — Background investigation against primary sources
- `/wait-what` — Re-explain previous statement in plain language
- `/wizard` — Interactive human-in-the-loop setup
