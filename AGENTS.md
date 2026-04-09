# AGENTS.md

## Project

freelifeofoctopus.com

## Mission

Build a decision-support tool platform.

Focus:

- Help users make decisions (not just calculations)
- Ship small useful tools first
- Grow platform capability gradually

---

## Product Structure

### A. Investment Tools (short-cycle)

- USD exchange risk tool
- dividend tools
- FX deposit vs exchange risk

### B. Event Product (long-term)

- favorites (core)
- calendar / list / map
- search / filter
- admin backend

### C. Traffic Tools

- WBC calculator
- seasonal / topical tools

### D. Platform Layer (NOT fully built)

- save / favorite
- share
- scenario persistence
- (future) account system

---

## Core Rule

Product decisions and implementation are separated.

During implementation:

- DO NOT redesign product structure
- DO NOT introduce new platform concepts
- FOLLOW existing product guardrails

---

## Favorites / Save Strategy (IMPORTANT)

### Tools (default)

- local save only
- no login
- no backend

### Event product (future)

- may use semi-platform save

### Full account system

- NOT now

---

## Save Object Types (DO NOT MIX)

1. favorite event
2. saved tool scenario
3. saved result snapshot

---

## UI / UX Rules (CRITICAL)

All tools must follow a consistent layout.

### Standard Layout (REQUIRED)

Each tool page MUST include:

1. Title area
   - tool name
   - short description (1~2 lines)

2. Input section
   - grouped inputs
   - clear labels
   - avoid too many fields

3. Action area
   - primary button (e.g. calculate)
   - optional example-fill button

4. Result section (IMPORTANT)  
   MUST include:
   - main result (highlighted)
   - interpretation (what it means)
   - optional status indicator (risk level)

5. Explanation section
   - simple explanation
   - help user understand result

---

### Result Design Rules

- DO NOT show only numbers
- MUST explain meaning (e.g. profit / risk / break-even)
- Highlight the key outcome clearly
- Use simple language (non-finance users must understand)

---

### Status Indicator (if applicable)

- independent from text color
- 3 states preferred (e.g. good / neutral / risk)
- should visually support decision

---

### Input UX Rules

- minimize required inputs
- provide defaults or examples when possible
- avoid complex forms
- prefer step-by-step mental model

---

### Consistency Rules

- reuse same layout across all tools
- keep spacing and section order consistent
- avoid redesigning each page differently
- naming should be consistent across tools

---

### Simplicity Rule (IMPORTANT)

This is NOT a dashboard system.

- avoid complex tables unless necessary
- avoid multi-step flows unless required
- keep interaction lightweight
- one page = one clear purpose

---

## Implementation Rules

- Prefer smallest useful version (MVP first)
- Reuse UI patterns
- Keep logic simple
- Keep data structure migration-friendly
- Avoid over-engineering

## Implementation Mindset
See: /docs/codex-playbook.md

---

## DO

- follow standard layout
- make results understandable
- keep UX simple
- keep tools fast and focused

---

## DO NOT

- add login / account system
- add backend unless required
- redesign layout per tool
- mix different UX styles
- build complex UI systems

---

## Escalation Required (STOP and ask)

Before implementing:

- login / auth
- cross-device sync
- backend favorites
- shared save across tools
- recommendation system
- notification system
- major UI redesign

---

## Workflow

Before coding:

1. Read README
2. Check similar tool
3. follow UI layout rules

After coding:

1. check UI consistency
2. ensure no architecture drift
3. keep changes minimal

---

## Mental Model

This is NOT a SaaS platform.

It is:
→ a growing family of decision tools

Simple first.
Consistent always.
Extend later.
