---
layout: knowledge-article
title: "Small automation that removes recurring delivery friction"
date: 2026-04-28
category: testing_automation
lang: en
slug: automation-scripts
permalink: /knowledge/automation-scripts.html
description: "Simple scripts, checks, and templates can remove repeated manual work before a full internal platform is justified."
---

Simple scripts, checks, and templates can remove repeated manual work before a full internal platform is justified.

## The Automation Sweet Spot

Most teams wait too long to automate. They think they need sophisticated CI/CD pipelines, but simple scripts solve 80% of problems with 5% of the effort.

## Identify Automation Candidates

Look for tasks that are:
- ✅ Done more than once per week
- ✅ Follow predictable steps
- ✅ Prone to human error
- ✅ Time-consuming (>5 minutes)
- ✅ Blocking other work

**Common candidates:**
- Database migrations
- Environment setup
- Data exports/imports
- Report generation
- Deployment steps
- Code formatting
- Test data creation

## Start Small: The Script Library

Create a `scripts/` directory with focused utilities:

```
project/
├── scripts/
│   ├── setup-dev.sh          # One-command dev environment
│   ├── deploy-staging.sh     # Safe deployment process
│   ├── backup-db.sh          # Automated backups
│   ├── generate-report.py    # Weekly metrics
│   └── cleanup-old-data.sh   # Maintenance task
└── README.md                 # How to use scripts
```

### Example: Development Setup Script

```bash
#!/bin/bash
# scripts/setup-dev.sh - One command to set up development environment

set -e  # Exit on error

echo "🚀 Setting up development environment..."

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "❌ Docker required"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose required"; exit 1; }

# Start services
echo "📦 Starting database and cache..."
docker-compose up -d db redis

# Wait for services
echo "⏳ Waiting for database..."
until docker-compose exec db pg_isready -U postgres; do
  sleep 1
done

# Run migrations
echo "🔄 Running database migrations..."
docker-compose run --rm web python manage.py migrate

# Load test data (optional)
if [ "$1" == "--with-data" ]; then
  echo "📊 Loading test data..."
  docker-compose run --rm web python manage.py loaddata fixtures/dev_data.json
fi

echo "✅ Development environment ready!"
echo "   App: http://localhost:8000"
echo "   Admin: http://localhost:8000/admin"
```

Usage:
```bash
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh           # Basic setup
./scripts/setup-dev.sh --with-data  # With sample data
```

## Template-Based Automation

For repetitive document creation, use templates with variable substitution:

### Example: Project Kickoff Template

```markdown
# scripts/templates/project-kickoff.md

# {{PROJECT_NAME}}

## Overview
{{DESCRIPTION}}

## Team
- Product Owner: {{PO_NAME}}
- Tech Lead: {{TECH_LEAD}}
- Developers: {{DEVELOPERS}}

## Timeline
- Kickoff: {{KICKOFF_DATE}}
- MVP Target: {{MVP_DATE}}
- Launch: {{LAUNCH_DATE}}

## Initial Setup
- [ ] Repository created
- [ ] CI/CD pipeline configured
- [ ] Development environment documented
- [ ] First sprint planned

## Resources
- Design files: {{DESIGN_LINK}}
- Requirements: {{REQUIREMENTS_LINK}}
- Slack channel: #{{SLACK_CHANNEL}}
```

Generator script:
```python
#!/usr/bin/env python3
# scripts/create-project.py

import sys
from datetime import datetime
from pathlib import Path

def create_project_kickoff(name, description, po, tech_lead):
    template = Path("scripts/templates/project-kickoff.md").read_text()
    
    content = template.replace("{{PROJECT_NAME}}", name)
    content = content.replace("{{DESCRIPTION}}", description)
    content = content.replace("{{PO_NAME}}", po)
    content = content.replace("{{TECH_LEAD}}", tech_lead)
    content = content.replace("{{KICKOFF_DATE}}", datetime.now().strftime("%Y-%m-%d"))
    # ... replace other variables
    
    output_path = Path(f"docs/{name.lower().replace(' ', '-')}-kickoff.md")
    output_path.write_text(content)
    print(f"✅ Created {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: create-project.py <name> <description> <po> <tech-lead>")
        sys.exit(1)
    
    create_project_kickoff(*sys.argv[1:])
```

Usage:
```bash
python scripts/create-project.py \
  "Payment Gateway Integration" \
  "Integrate Stripe for subscription billing" \
  "Alice Johnson" \
  "Bob Smith"
```

## Scheduled Automation with Cron

For recurring tasks, use cron jobs:

```bash
# Edit crontab
crontab -e

# Add entries
# Daily backup at 2 AM
0 2 * * * /path/to/scripts/backup-db.sh >> /var/log/backups.log 2>&1

# Weekly report every Monday at 9 AM
0 9 * * 1 /path/to/scripts/generate-report.py --email team@company.com

# Monthly cleanup on 1st at 3 AM
0 3 1 * * /path/to/scripts/cleanup-old-data.sh --days 90
```

## Git Hooks for Quality Gates

Automate checks before commits:

```bash
# .git/hooks/pre-commit
#!/bin/bash

echo "🔍 Running pre-commit checks..."

# Format check
if ! black --check .; then
  echo "❌ Code not formatted. Run 'black .' first."
  exit 1
fi

# Type checking
if ! mypy src/; then
  echo "❌ Type errors found."
  exit 1
fi

# Quick tests
if ! pytest tests/unit/ -q; then
  echo "❌ Unit tests failed."
  exit 1
fi

echo "✅ All checks passed!"
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

## Monitoring Simple Automation

Track what's working:

```python
# scripts/monitor-automation.py
import json
from datetime import datetime
from pathlib import Path

LOG_FILE = Path("logs/automation.log")

def log_execution(script_name, success, duration_seconds, error=None):
    entry = {
        "timestamp": datetime.now().isoformat(),
        "script": script_name,
        "success": success,
        "duration": duration_seconds,
        "error": error
    }
    
    LOG_FILE.parent.mkdir(exist_ok=True)
    with open(LOG_FILE, "a") as f:
        f.write(json.dumps(entry) + "\n")

def generate_report():
    """Show automation effectiveness"""
    if not LOG_FILE.exists():
        print("No automation logs found")
        return
    
    executions = []
    for line in LOG_FILE.read_text().splitlines():
        executions.append(json.loads(line))
    
    total = len(executions)
    successful = sum(1 for e in executions if e["success"])
    avg_duration = sum(e["duration"] for e in executions) / total if total else 0
    
    print(f"Automation Report:")
    print(f"  Total runs: {total}")
    print(f"  Success rate: {successful/total*100:.1f}%")
    print(f"  Average duration: {avg_duration:.1f}s")
    print(f"  Time saved: ~{total * 5} minutes (estimated)")

if __name__ == "__main__":
    generate_report()
```

## When to Level Up

Move from scripts to proper CI/CD when:
- You have >10 automation scripts
- Multiple people maintain the scripts
- You need parallel execution
- Compliance requires audit trails
- Scripts become complex (>100 lines)

Until then, keep it simple.

## Common Pitfalls

### ❌ Over-Automation
Automating something that changes weekly creates maintenance burden.

**Fix:** Automate stable processes first. Wait for patterns to emerge.

### ❌ No Error Handling
Scripts fail silently and nobody knows.

**Fix:** Always log failures and send alerts for critical automations.

### ❌ Hidden Knowledge
Only one person knows how the scripts work.

**Fix:** Document each script with examples in a README.

### ❌ Brittle Dependencies
Scripts break when tools update.

**Fix:** Pin versions and test after dependency updates.

## Measuring ROI

Track time saved:

```
Manual task: 15 minutes × 3 times/week = 45 min/week
Automation: 5 minutes setup + 2 minutes/week maintenance = 7 min/week
Net savings: 38 minutes/week = 33 hours/year
```

Even saving 30 minutes per week adds up to significant annual gains.

## Conclusion

Start with scripts. Master the basics. Then scale up when needed. Most teams never need complex automation platforms—they need reliable, simple scripts that save time today.

Automate the boring stuff. Focus your energy on the interesting problems.
