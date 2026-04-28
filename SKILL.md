---
name: memory-loader
description: >
  Automatically loads and indexes project memory files at session start, and writes
  new learnings back at session end. Use this skill whenever you start a new Claude
  Code session and want Claude to remember what happened in previous sessions — past
  decisions, file changes, open issues, project context. Also use it to explicitly
  save what was learned after a long session. Works across all projects (Argus,
  Expose, Airwave, Gastrochat, etc.) by detecting the current project directory
  automatically. Invoke with: "load my memory", "what did we do last time?",
  "save session memory", or it runs automatically via SessionStart/SessionStop hooks.
---

# Memory Loader

Loads project-specific memory files into context at session start, and writes
new learnings back at session end. Works with context-mode (FTS5 indexing) when
available, falls back to direct Read otherwise.

---

## Directory Convention

Memory lives at:
```
~/.claude/projects/[sanitized-project-path]/memory/
├── MEMORY.md       ← main memory file (always present)
└── *.md            ← optional topic-specific files
```

The sanitized path replaces `/` with `-`, e.g.:
- `/Users/you/Projekte/project-argus` → `-Users-you-Projekte-project-argus`

---

## On Session Start — Loading Memory

1. Determine the current project directory:
   ```bash
   pwd
   ```

2. Build the memory path:
   ```bash
   PROJ=$(pwd | sed 's|/|-|g')
   MEMORY_DIR="$HOME/.claude/projects/$PROJ/memory"
   ```

3. If the directory does not exist, create it and write a starter MEMORY.md
   using the Template section below.

4. Index all .md files into context-mode FTS5 (if available):
   - Call `ctx_index` for each `.md` file in the memory directory
   - Tell the user: "Memory loaded — [N] files indexed from [path]"

5. Summarize briefly: last session date, current phase, open items.

---

## On Session End — Writing Memory

When the user says "save memory", "session done", or on SessionStop:

1. Summarize this session in ≤10 bullet points:
   - Files created or modified (with paths)
   - Decisions made and why
   - Bugs found or fixed
   - Open items / next steps

2. Append to `MEMORY.md` with a dated header:
   ```markdown
   ## Session: YYYY-MM-DD HH:MM
   - ...
   ```

3. Confirm: "Memory saved to [path]."

---

## Template — New MEMORY.md

```markdown
# Project Memory

> Auto-managed by memory-loader.
> Last updated: [date]

## Project Overview
[1-2 sentences]

## Current Phase
[Phase / sprint]

## Open Items
- [ ] ...

## Sessions
<!-- Appended automatically -->
```

---

## Context-Mode Integration

If `ctx_index` MCP tool is available:
- Index each memory file via `ctx_index <file_path>`
- Enables `ctx_search "open items"` later in the session

If context-mode is NOT available:
- Read MEMORY.md directly with the Read tool
- Summarize contents inline

---

## Rules

- Never delete existing memory entries — only append
- Bullet points only, no prose paragraphs
- Paths always in backticks
- No secrets, API keys, or credentials in memory files
