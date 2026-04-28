# memory-loader

> File-based project memory for Claude Code.
> Loads previous session context automatically. Writes new learnings back at session end.

## What it does

- **Session Start** — reads all `*.md` files from your project's memory directory and loads them into context (via context-mode FTS5 if available)
- **Session End** — prompts Claude to summarize the session and append it to `MEMORY.md`
- **Project-agnostic** — works with any project, detects directory automatically

## Install

```
/plugin marketplace add peterzeleznik/memory-loader
/plugin install memory-loader@memory-loader
```

## Memory location

```
~/.claude/projects/[sanitized-project-path]/memory/
├── MEMORY.md        ← main file, auto-created on first run
└── *.md             ← optional topic files
```

## Works best with

- [context-mode](https://github.com/mksglu/context-mode) — indexes memory into FTS5 for fast search

## License

MIT
