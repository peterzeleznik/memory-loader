#!/usr/bin/env node
/**
 * memory-loader — SessionStart hook
 * Reads all *.md files from the project memory directory and prints
 * a summary so Claude picks it up at session start.
 */

import { readFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

const today = new Date().toISOString().slice(0, 10)

const MEMORY_TEMPLATE = `# Project Memory

> Auto-managed by memory-loader.
> Last updated: ${today}

## Project Overview
[Describe the project in 1-2 sentences]

## Current Phase
[Current phase or sprint]

## Open Items
- [ ] ...

## Sessions
<!-- Sessions are appended automatically by memory-loader -->
`

function getMemoryDir() {
  const projectDir = process.cwd()
  const sanitized = projectDir.replace(/\//g, '-')
  return join(homedir(), '.claude', 'projects', sanitized, 'memory')
}

function main() {
  const memoryDir = getMemoryDir()

  // Create directory + starter MEMORY.md if missing
  if (!existsSync(memoryDir)) {
    mkdirSync(memoryDir, { recursive: true })
    writeFileSync(join(memoryDir, 'MEMORY.md'), MEMORY_TEMPLATE)
    console.log(`[memory-loader] Created new memory directory: ${memoryDir}`)
    return
  }

  // Read all .md files
  const files = readdirSync(memoryDir).filter(f => f.endsWith('.md'))

  if (files.length === 0) {
    writeFileSync(join(memoryDir, 'MEMORY.md'), MEMORY_TEMPLATE)
    console.log(`[memory-loader] No memory files found — created MEMORY.md template`)
    return
  }

  // Print contents so Claude picks them up in context
  console.log(`[memory-loader] Loading ${files.length} memory file(s) from ${memoryDir}\n`)
  console.log('---BEGIN MEMORY---')

  for (const file of files) {
    const content = readFileSync(join(memoryDir, file), 'utf-8')
    console.log(`\n### ${file}\n`)
    console.log(content)
  }

  console.log('---END MEMORY---')
  console.log(`\n[memory-loader] Done. Use ctx_search to query indexed memory.`)
}

main()
