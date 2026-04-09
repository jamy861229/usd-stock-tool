# Tool Pattern

## Purpose

Define the standard structure and behavior for all tools.

Goal:
- Ensure UI/UX consistency
- Enable fast tool creation
- Reduce redesign and variation
- Make tools predictable for users

---

## When to use

Use this pattern when:

- creating a new tool
- refactoring an existing tool
- aligning UI/UX across tools

Do NOT use for:

- backend systems
- admin pages
- multi-step workflows

---

## Core Principle

All tools must follow:

→ One page  
→ One purpose  
→ One decision

---

## Page Structure (REQUIRED)

All tools MUST follow this order:

```text
Title
↓
Input
↓
Action
↓
Result
↓
Explanation