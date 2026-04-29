# memory-loader

> File-based project memory for Claude Code.
> Install once — works automatically in every project.

## The key thing

Install it once with user scope. That's it.

Every project gets its **own isolated memory**, loaded automatically at session start.
- Working on your SaaS? → loads SaaS memory
- Switching to your agency project? → loads that memory instead
- New project? → creates a fresh `MEMORY.md` template automatically

No configuration. No activation. Just open Claude Code and your context is there.

## What it does

- **Session Start** — detects your current project directory, reads all `*.md` files from its memory folder, and prints them into Claude's context window automatically
- **Session End** — automatically writes a session entry to `feedback_session_log.md` using git facts (branch, last 5 commits, changed files). No Claude action required — always logged, even if Claude forgets.
- **Auto-creates** `MEMORY.md` on first run if none exists

## Memory files

Each project gets its own memory directory:

```
~/.claude/projects/[project-path]/memory/
├── MEMORY.md                  ← main file, auto-created on first run
├── feedback_session_log.md    ← auto-written at every session end
└── *.md                       ← optional topic files (decisions, architecture, bugs...)
```

Example — if you have 3 projects:
```
~/.claude/projects/-Users-you-my-saas/memory/MEMORY.md
~/.claude/projects/-Users-you-agency-site/memory/MEMORY.md
~/.claude/projects/-Users-you-side-project/memory/MEMORY.md
```

Each one is independent. Claude never mixes them up.

## Session log format

At every session end, the hook writes automatically:

```markdown
### Session: 2026-04-29 14:32
- **Branch:** main
- **Commits (letzte 5):**
  feat: add oauth flow
  fix: token refresh
- **Geänderte Dateien:**
  src/components/Auth.tsx
  supabase/functions/oauth/index.ts
- **Notizen:** _(Claude kann hier ergänzen)_
- **Offen:** _(Claude kann hier ergänzen)_
```

## Install

```
/plugin marketplace add peterzeleznik/memory-loader
/plugin install memory-loader@memory-loader
```

Choose **"Install for you (user scope)"** — this makes it active in all your projects automatically.

## Works best with

- [context-mode](https://github.com/mksglu/context-mode) — after session start, ask Claude to run `ctx_index` on your memory files for FTS5 search support

## License

MIT
