#!/usr/bin/env node
/**
 * memory-loader — SessionStart hook
 * - Neues Projekt: legt Memory-Verzeichnis + MEMORY.md automatisch an
 * - Bestehendes Projekt: druckt alle Memory-Files als Banner in den Kontext
 */

import { readFileSync, existsSync, readdirSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

const today = new Date().toISOString().slice(0, 10)

function getMemoryDir() {
  const projectDir = process.cwd()
  const sanitized = projectDir.replace(/\//g, '-')
  return join(homedir(), '.claude', 'projects', sanitized, 'memory')
}

function createStarter(memoryDir) {
  mkdirSync(memoryDir, { recursive: true })

  const template = `---
name: Projektübersicht
description: Automatisch angelegt von memory-loader beim ersten Start
type: project
---
# Projektübersicht

> Angelegt: ${today}
> Pfad: ${process.cwd()}

## Projekt auf einen Blick

_Beschreibe das Projekt in 1-2 Sätzen._

## Stack

_Tech Stack eintragen._

## Non-Negotiables

_Wichtige Regeln, die nie vergessen werden dürfen._

## Aktueller Stand

- **Phase:** _eintragen_
- **Nächste Prio:** _eintragen_

## Offene Punkte

- [ ] _eintragen_

## Sessions

_Wird automatisch von memory-loader am Session-Ende ergänzt._
`

  writeFileSync(join(memoryDir, 'MEMORY.md'), template)
  console.log(`[memory-loader] Neues Projekt erkannt — Memory-Verzeichnis angelegt:`)
  console.log(`  ${memoryDir}`)
  console.log(`  → MEMORY.md erstellt. Bitte Projektbeschreibung eintragen.`)
}

function main() {
  const memoryDir = getMemoryDir()

  // Neues Projekt: automatisch anlegen
  if (!existsSync(memoryDir)) {
    createStarter(memoryDir)
    return
  }

  const files = readdirSync(memoryDir).filter(f => f.endsWith('.md'))

  // Verzeichnis leer: Starter anlegen
  if (files.length === 0) {
    createStarter(memoryDir)
    return
  }

  // Bestehendes Projekt: Memory laden
  const ordered = [
    'MEMORY.md',
    ...files.filter(f => f !== 'MEMORY.md').sort()
  ].filter(f => files.includes(f))

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`  PROJECT MEMORY LOADED (${ordered.length} files)`)
  console.log(`  ${memoryDir}`)
  console.log(`${'═'.repeat(60)}\n`)

  for (const file of ordered) {
    const content = readFileSync(join(memoryDir, file), 'utf-8')
    console.log(`\n### ${file}\n`)
    console.log(content)
    console.log()
  }

  console.log(`${'═'.repeat(60)}`)
  console.log(`  REMEMBER: Update feedback_session_log.md at session end.`)
  console.log(`${'═'.repeat(60)}\n`)
}

main()
