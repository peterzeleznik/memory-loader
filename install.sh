#!/usr/bin/env bash
# memory-loader installer
# Usage: bash install.sh
set -e

PLUGIN_DIR="$HOME/.claude/plugins/memory-loader"
REPO="https://github.com/peterzeleznik/memory-loader.git"

echo ""
echo "  memory-loader installer"
echo "  ━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Clone or update
if [ -d "$PLUGIN_DIR/.git" ]; then
  echo "→ Updating existing installation..."
  git -C "$PLUGIN_DIR" pull origin main --quiet
else
  echo "→ Cloning memory-loader..."
  git clone "$REPO" "$PLUGIN_DIR" --quiet
fi

echo "✓ Files ready at $PLUGIN_DIR"

# 2. Register hooks in settings.json via Node.js
node - <<'EOF'
const fs = require('fs')
const path = require('path')
const os = require('os')

const settingsPath = path.join(os.homedir(), '.claude', 'settings.json')
const hooksDir = path.join(os.homedir(), '.claude', 'plugins', 'memory-loader', 'hooks')
const startCmd = `node ${path.join(hooksDir, 'session-start.mjs')}`
const endCmd   = `node ${path.join(hooksDir, 'session-end.mjs')}`

let settings = {}
if (fs.existsSync(settingsPath)) {
  try { settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8')) }
  catch (e) { console.error('✗ Could not parse settings.json:', e.message); process.exit(1) }
}
if (!settings.hooks) settings.hooks = {}

function addHook(event, cmd) {
  if (!settings.hooks[event]) settings.hooks[event] = [{ hooks: [] }]
  const entry = settings.hooks[event][0]
  const list = entry.hooks ?? entry
  if (Array.isArray(list) && !list.some(h => h.command === cmd)) {
    list.push({ type: 'command', command: cmd })
    console.log(`✓ ${event} hook registered`)
  } else {
    console.log(`→ ${event} hook already registered`)
  }
}

addHook('SessionStart', startCmd)
addHook('SessionEnd',   endCmd)

fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2))
console.log('✓ ~/.claude/settings.json updated')
EOF

echo ""
echo "  ✅ Done! Restart Claude Code to activate memory-loader."
echo "     On next session start your project memory loads automatically."
echo ""
