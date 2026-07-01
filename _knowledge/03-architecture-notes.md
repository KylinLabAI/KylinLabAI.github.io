---
layout: knowledge-article
title: "Architecture notes that help teams decide faster"
date: 2026-04-28
category: architecture
lang: en
slug: architecture-notes
permalink: /knowledge/architecture-notes.html
description: "Good design notes capture the tradeoff, the chosen direction, and what evidence would change the decision later."
---

Good design notes capture the tradeoff, the chosen direction, and what evidence would change the decision later.

## Why Architecture Decisions Get Stuck

Teams debate architecture for weeks because they're trying to predict the future. But good architecture isn't about being right forever—it's about making reversible decisions with clear criteria.

## The ADR Pattern (Architecture Decision Record)

Document each significant decision using this template:

```markdown
# ADR-001: Choose PostgreSQL over MongoDB

## Context
We need a database for user data with complex queries and transactions.

## Decision
Use PostgreSQL 15 with JSONB support.

## Consequences

### Positive
- ACID transactions ensure data integrity
- Complex joins supported natively
- Strong ecosystem and tooling
- Team has existing PostgreSQL experience

### Negative
- Less flexible schema changes than NoSQL
- Horizontal scaling more complex
- Higher operational overhead initially

## Reversibility
Medium. Migration possible but requires effort.

## Review Criteria
Revisit if:
- Query performance degrades with >1M records
- Schema changes needed weekly or more
- Team reports significant friction with relational model
```

## What Makes Good Architecture Notes

### 1. Capture the Tradeoff

Every decision has costs. Document them honestly:

**Bad:** "We chose React because it's popular"  
**Good:** "We chose React despite Vue's simpler learning curve because our team already knows JSX patterns and we need the larger component ecosystem"

### 2. State Assumptions Explicitly

```yaml
Assumptions:
  - Traffic will stay under 10K daily users for first year
  - Team size will remain 3-5 developers
  - Budget allows $500/month infrastructure spend
  - No real-time collaboration features needed initially
```

When assumptions change, re-evaluate the decision.

### 3. Define Success Metrics

How will you know if the decision was right?

```
Metrics to track:
- API response time < 200ms at p95
- Database query time < 50ms average
- Deployment frequency: 2x per week minimum
- Time to onboard new developer: < 2 days
```

### 4. Note What Would Change Your Mind

The best architecture decisions include exit criteria:

```
We'll reconsider this decision if:
☐ Performance benchmarks show 30%+ degradation
☐ Team velocity drops below 15 story points/sprint for 3 sprints
☐ Customer requests require fundamental architectural changes
☐ New technology emerges that solves our core problem 2x better
```

## Common Architecture Decision Categories

### Data Storage
- SQL vs NoSQL
- Single database vs polyglot persistence
- Managed service vs self-hosted

### Communication Patterns
- REST vs GraphQL vs gRPC
- Synchronous vs asynchronous
- Event-driven vs request-response

### Deployment Strategy
- Monolith vs microservices
- Serverless vs containers vs VMs
- Single region vs multi-region

### Development Approach
- Framework choice (React, Vue, Angular, etc.)
- Language selection
- Testing strategy

## When to Write ADRs

Write an ADR when:
- ✅ Multiple viable options exist
- ✅ Decision affects multiple teams
- ✅ Changing course later would be expensive
- ✅ Team members disagree on approach

Skip ADRs when:
- ❌ Obvious best choice exists
- ❌ Decision is easily reversible
- ❌ Impact is limited to one developer
- ❌ It's purely a preference issue

## Keeping ADRs Alive

### Monthly Review
Scan recent ADRs. Are assumptions still valid?

### Trigger-Based Review
When metrics hit review criteria, automatically revisit the decision.

### Sunset Old ADRs
Mark decisions as superseded when replaced. Keep history for learning.

## Example: Real ADR in Action

```markdown
# ADR-003: Use Redis for Session Management

Date: 2026-03-15
Status: Accepted

## Context
Current session storage in application memory doesn't scale across multiple instances.

## Options Considered
1. **Redis** - Fast, proven, supports TTL natively
2. **Database sessions** - Simpler ops, but slower
3. **JWT tokens** - Stateless, but can't invalidate easily

## Decision
Use Redis with 30-minute TTL for user sessions.

## Rationale
- Sub-millisecond read/write performance
- Automatic expiration prevents stale sessions
- Can share sessions across load-balanced instances
- Team has Redis operational experience

## Implementation Notes
- Use Redis cluster mode for high availability
- Store only session ID and minimal user context
- Implement graceful fallback if Redis unavailable

## Review Date: 2026-06-15
Check: Session store performance at scale, operational complexity
```

## Conclusion

Architecture decisions don't need to be perfect—they need to be documented, reversible, and measurable. Good notes turn debates into experiments and opinions into testable hypotheses.

Write less, document better, decide faster.
