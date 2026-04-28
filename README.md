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
- **Session End** — prompts Claude to summarize the session and append it to `MEMORY.md`
- **Auto-creates** `MEMORY.md` on first run if none exists

## Install

```
/plugin marketplace add peterzeleznik/memory-loader
/plugin install memory-loader@memory-loader
```

Choose **"Install for you (user scope)"** — this makes it active in all your projects automatically.

## Memory location

Each project gets its own memory directory:

```
~/.claude/projects/[project-path]/memory/
├── MEMORY.md        ← main file, auto-created on first run
└── *.md             ← optional topic files (decisions, architecture, bugs...)
```

Example — if you have 3 projects:
```
~/.claude/projects/-Users-you-my-saas/memory/MEMORY.md
~/.claude/projects/-Users-you-agency-site/memory/MEMORY.md
~/.claude/projects/-Users-you-side-project/memory/MEMORY.md
```

Each one is independent. Claude never mixes them up.

## Works best with

- [context-mode](https://github.com/mksglu/context-mode) — after session start, ask Claude to run `ctx_index` on your memory files for FTS5 search support

## License

MIT
