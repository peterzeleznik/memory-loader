#!/usr/bin/env node
/**
 * memory-loader — SessionStop hook
 * Signals Claude to summarize the session and append to MEMORY.md.
 * The actual write happens via Claude — this hook prints the format.
 */

import { existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

function getMemoryDir() {
  const projectDir = process.cwd()
  const sanitized = projectDir.replace(/\//g, '-')
  return join(homedir(), '.claude', 'projects', sanitized, 'memory')
}

function main() {
  const memoryDir = getMemoryDir()
  const memoryFile = join(memoryDir, 'MEMORY.md')

  if (!existsSync(memoryFile)) {
    console.log('[memory-loader] No MEMORY.md found — nothing to save.')
    return
  }

  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ')

  console.log(`[memory-loader] Session ending at ${timestamp}`)
  console.log(`[memory-loader] Summarize this session and append to: ${memoryFile}`)
  console.log(``)
  console.log(`Format:`)
  console.log(`## Session: ${timestamp}`)
  console.log(`- Files modified: \`path/to/file.ts\``)
  console.log(`- Decision: [what and why]`)
  console.log(`- Fixed: [bug description]`)
  console.log(`- Open: [ ] [next step]`)
}

main()
