---
layout: knowledge-article
title: "Delivery plans that survive real project pressure"
date: 2026-04-28
category: pm
lang: en
slug: delivery-plans
permalink: /knowledge/delivery-plans.html
description: "A lightweight approach for tracking risk, scope, ownership, and decision points."
---

A direct way to connect goals, owners, risks, and review points without turning delivery tracking into a heavy process.

## The Problem with Traditional Plans

Most project plans fail because they're either too rigid (can't adapt to change) or too vague (provide no guidance). Real projects need something in between.

## Core Principles

### 1. Track Outcomes, Not Tasks

Instead of listing hundreds of tasks, focus on deliverables:

**Bad:**
- Write API endpoint
- Create database schema
- Build UI component

**Good:**
- User can submit form and receive confirmation
- Admin can view all submissions in dashboard

### 2. Make Risks Visible Early

Maintain a living risk register:

| Risk | Impact | Mitigation | Owner |
|------|--------|------------|-------|
| Third-party API unstable | High | Build fallback mechanism | Alice |
| Scope creep from stakeholders | Medium | Weekly scope review | Bob |
| Key developer availability | High | Cross-train team members | Carol |

Review this weekly, not monthly.

### 3. Define Clear Decision Points

Identify moments where the project could go different directions:

```
Week 2: Choose database technology
Week 4: Validate core workflow with users
Week 6: Decide whether to build or buy reporting module
```

Each decision point should have:
- Clear criteria for success
- Who makes the decision
- What happens if we delay

### 4. Keep Ownership Explicit

Every deliverable needs exactly one owner. Not a team, not "TBD"—one person.

```yaml
Deliverable: User authentication system
Owner: @alice
Due: Week 3
Dependencies: Database setup complete
Success Criteria: Users can register, login, and reset password
```

### 5. Review Rhythm That Works

**Daily (15 min):** Blockers and immediate needs  
**Weekly (60 min):** Progress, risks, next week's priorities  
**Bi-weekly (90 min):** Demo working software, adjust plan  

Skip meetings that don't produce decisions or unblock work.

## Template: One-Page Delivery Plan

```markdown
# Project: [Name]

## Goals
- Goal 1 (owner, due date)
- Goal 2 (owner, due date)

## Current Sprint (Week X-Y)
- Deliverable A → Owner
- Deliverable B → Owner

## Top 3 Risks
1. Risk description → Mitigation
2. Risk description → Mitigation
3. Risk description → Mitigation

## Next Decision Points
- Date: Decision to make → Criteria
- Date: Decision to make → Criteria

## Blockers
- Blocker 1 → Who's resolving it
- Blocker 2 → Who's resolving it
```

Keep this visible. Update it weekly. Share it broadly.

## When Plans Fail

Plans fail when:
- They're created once and never updated
- They track activity instead of outcomes
- They hide bad news
- They're owned by PMs, not the team

Fix: Make planning a team sport. Update plans based on reality, not hopes.

## Conclusion

Good delivery plans are living documents that help teams navigate uncertainty. They're not about predicting the future—they're about creating clarity in the present.

Keep them simple, keep them current, and keep them honest.
