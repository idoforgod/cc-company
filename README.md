# cc-company

Run Claude Code like a company — organize AI agents by role, run them with one command.

```bash
npx cc-company init
cc-company run developer "Fix the login bug"
cc-company run designer "Redesign the onboarding flow"
```

## Why?

Claude Code is powerful, but every session starts from zero. No role specialization, no persistent expertise, no team structure.

**cc-company** gives Claude Code an org chart:
- **Agents** = job roles (developer, designer, HR) with dedicated system prompts
- **Subagents** = specialized skills attached to each role (git-expert, code-reviewer)
- **Skills & Hooks** = reusable capabilities shared across agents

One command, and the right agent runs with the right context.

## Install

```bash
npm install -g cc-company
```

> Requires [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI installed and authenticated.

## Quick Start

### 1. Initialize

```bash
cc-company init
```

Creates a `.cc-company/` directory with 3 default agents: `developer`, `designer`, `hr` — each pre-configured with role-specific prompts and subagents.

### 2. Run an Agent

```bash
# Interactive mode
cc-company run developer "Refactor the auth module"

# Headless mode (for scripts/CI)
cc-company run developer "Run all tests and fix failures" -p

# Pass any Claude Code flag
cc-company run developer "Explain this codebase" --model opus
```

### 3. Customize

```bash
# Create a new agent
cc-company agent create qa-engineer

# Add a subagent to it
cc-company agent qa-engineer add subagent test-strategist

# Add a shared skill
cc-company agent qa-engineer add skill deploy
```

## How It Works

```
cc-company run developer "Fix the bug"
        │
        ▼
┌─ Loads agent config ──────────────────────┐
│  prompt.md → --append-system-prompt-file  │
│  subagents → --agents '{...}'             │
│  mcp.json  → --mcp-config                │
│  settings  → --settings                   │
└───────────────────────────────────────────┘
        │
        ▼
  claude "Fix the bug" --append-system-prompt-file ...
```

cc-company translates your agent configuration into Claude Code CLI flags, then spawns `claude` with full stdin/stdout passthrough. No API keys needed — it uses your existing Claude Code subscription.

## Directory Structure

```
.cc-company/
├── config.json           # Project config
├── agents/
│   ├── developer/
│   │   ├── agent.json    # Role metadata + resource refs
│   │   ├── prompt.md     # System prompt for this role
│   │   ├── settings.json # Claude Code settings (optional)
│   │   └── mcp.json      # MCP servers (optional)
│   ├── designer/
│   └── hr/
├── subagents/            # Shared specialist pool
├── skills/               # Shared capabilities
├── hooks/                # Shared hooks
└── runs/                 # Execution logs (JSON)
```

## Commands

| Command | Description |
|---|---|
| `cc-company init` | Initialize project (add `--force` to overwrite) |
| `cc-company run <agent> <prompt>` | Run an agent |
| `cc-company agent create <name>` | Create a new agent |
| `cc-company agent list` | List all agents |
| `cc-company agent remove <name>` | Remove an agent |
| `cc-company agent <name> show` | Show agent details |
| `cc-company agent <name> add subagent <res>` | Assign a subagent |
| `cc-company agent <name> add skill <res>` | Assign a skill |
| `cc-company agent <name> remove subagent <res>` | Unassign a subagent |
| `cc-company subagent list` | List shared subagents |
| `cc-company skill list` | List shared skills |
| `cc-company hook list` | List shared hooks |

## Default Agents

| Agent | Role | Subagents | Skills |
|---|---|---|---|
| `developer` | Software development | git-expert, code-reviewer | deploy |
| `designer` | UI/UX design | ux-researcher | design-system |
| `hr` | Talent & culture | recruiter | onboarding |

## License

MIT
