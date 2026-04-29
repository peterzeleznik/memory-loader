#!/usr/bin/env node
/**
 * memory-loader — SessionEnd hook
 * Automatically writes a session entry to feedback_session_log.md
 * using git facts — no Claude action required.
 */

import { existsSync, appendFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import { execSync } from 'child_process'

function getMemoryDir() {
  const projectDir = process.cwd()
  const sanitized = projectDir.replace(/\//g, '-')
  return join(homedir(), '.claude', 'projects', sanitized, 'memory')
}

function run(cmd) {
  try {
    return execSync(cmd, { cwd: process.cwd(), encoding: 'utf-8' }).trim()
  } catch {
    return null
  }
}

function main() {
  const memoryDir = getMemoryDir()
  const logFile = join(memoryDir, 'feedback_session_log.md')

  if (!existsSync(memoryDir)) {
    console.log('[memory-loader] No memory directory — skipping session log.')
    return
  }

  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ')

  // Gather git facts automatically
  const branch = run('git rev-parse --abbrev-ref HEAD') ?? 'unknown'
  const recentCommits = run('git log --oneline -5') ?? '(no commits)'
  const changedFiles = run('git diff --name-only HEAD~1 HEAD 2>/dev/null || git diff --name-only') ?? '(no changes)'
  const uncommitted = run('git status --short') ?? ''

  const entry = `
### Session: ${timestamp}
- **Branch:** ${branch}
- **Commits (letzte 5):**
\`\`\`
${recentCommits}
\`\`\`
- **Geänderte Dateien:**
\`\`\`
${changedFiles || '(keine)'}
\`\`\`
${uncommitted ? `- **Uncommitted:**\n\`\`\`\n${uncommitted}\n\`\`\`` : ''}
- **Notizen:** _(Claude soll hier ergänzen)_
- **Offen:** _(Claude soll hier ergänzen)_

`

  if (!existsSync(logFile)) {
    writeFileSync(logFile, `---\nname: Session-Dokumentation\ndescription: Automatisch geloggte Sessions mit Git-Fakten\ntype: feedback\n---\n`)
  }

  appendFileSync(logFile, entry)

  console.log(`[memory-loader] Session logged → ${logFile}`)
  console.log(`[memory-loader] Branch: ${branch} | ${timestamp}`)
}

main()
