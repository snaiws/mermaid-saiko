# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **documentation-first, planning-driven project repository** that follows a rigorous DDD (Domain-Driven Design) methodology. The project enforces a strict workflow where **all planning documents must be completed before any implementation begins**.

**Key Philosophy**: Documentation comes before code. All work is tracked through Git commits, and progress is managed through structured markdown documents.

## Core Principles (Critical - Read First)

1. **Documentation First**: Never write implementation code before planning documents are complete and approved
2. **Approval-Based Progress**: Never proceed without checkbox approvals from the user
3. **No Assumptions**: Always ask questions instead of guessing user intent
4. **Active Critical Review**: Always critically evaluate user suggestions and proactively propose improvements, potential issues, or missed aspects
5. **Git-Based Workflow**: All changes must be committed to Git
6. **Roadmap Updates**: Update `documents/planning/roadmap.md` after every task completion
7. **Open Questions Management**: Add unresolved items to `documents/planning/open-questions.md` immediately; remove them only after related documents are updated

## Document Structure

### Planning Phase Documents (in `documents/`)

All documents are in Korean and follow this hierarchy:

```
documents/
├── PROJECT-RULES.md           # Master workflow rules (read on every new session)
├── planning/
│   ├── PROJECT-OVERVIEW.md    # Project proposal/overview
│   ├── roadmap.md             # Progress tracking (tree structure with checkboxes)
│   └── open-questions.md      # Unresolved questions/decisions
├── requirements/
│   └── {category}-requirements.md  # Functional requirements (table format)
├── domain-modeling/
│   ├── {context-name}/        # Per bounded context
│   │   ├── aggregates.md
│   │   ├── events.md
│   │   └── language.md
│   └── bounded-contexts.md    # Overview of all contexts
├── api/
│   └── {context}-api.md       # API specs per bounded context
└── architecture/
    ├── system-overview.md
    ├── technology-stack.md    # Tech stack with library comparison
    ├── microservices-design.md
    ├── database-design.md
    ├── event-driven-design.md
    └── frontend-architecture.md
```

## Development Process (6 Stages)

**Stage 1: Planning** → **Stages 2-5: Design** → **Stage 6: Implementation**

### Stage 1: Planning
- Create `PROJECT-OVERVIEW.md` with background, problem definition, solution approach
- Must get user approval before proceeding

### Stage 2: Functional Requirements
- Define **user-facing features only** in table format
- **NO DDD terminology** (no Context, Aggregate, Entity)
- **NO API specifications** (endpoint/request/response)
- Use checkbox system for approval
- Target ~200 lines (avoid 1000+ line documents)

### Stage 3: Domain Modeling
- **Now introduce DDD concepts**: Bounded Contexts, Aggregates, Domain Events
- Map Stage 2 features to domain structure
- Define Ubiquitous Language

### Stage 4: API Design
- Define all endpoints with Request/Response specs
- Swagger will handle detailed validation
- Simple table format: Function ID, Method, Endpoint, Request, Response, Notes

### Stage 5: Architecture + Database Design
- System architecture overview
- Technology stack selection with **web search required** for library comparisons
- Document all candidate libraries (including rejected ones with pros/cons)
- Database schemas with indexes and constraints
- Event-driven design
- Frontend architecture (minimal - only structure, routing, component hierarchy)

### Stage 6: Implementation
**Prerequisites**: All Stage 1-5 documents must be completed and approved

Implementation order:
1. Project structure setup
2. Domain Layer (pure TypeScript/language)
3. Application Layer (Use Cases)
4. Infrastructure Layer (frameworks like NestJS, TypeORM)
5. API Layer (Controllers)
6. Tests

## Session Workflow

### At Session Start
1. Read `documents/planning/roadmap.md` (progress status)
2. Read `documents/planning/open-questions.md` (unresolved items)
3. Set session goals

### During Session
- Update relevant documents in real-time
- Get checkbox approval for each feature/decision
- Add unresolved items to `open-questions.md`
- Update `roadmap.md` progress after each completed task

### At Session End
1. Update `roadmap.md` with completed checkboxes
2. Add any new open questions to `open-questions.md`
3. Commit all changes to Git

## Critical Rules

### Must Do
- ✅ Read `documents/PROJECT-RULES.md` at the start of every new session
- ✅ Ask questions instead of making assumptions
- ✅ Critically review user suggestions and propose better alternatives
- ✅ Update roadmap after every task
- ✅ Use web search when researching libraries/technologies
- ✅ Document all library candidates (including rejected ones)

### Must NOT Do
- ❌ Check approval checkboxes yourself (user only)
- ❌ Write implementation code before planning docs are complete
- ❌ Proceed without explicit user approval
- ❌ Add features not requested by user
- ❌ Mix DDD terminology into Stage 2 (functional requirements)
- ❌ Use try-catch or logging excessively in early development
- ❌ Use monkey patching

## Approval System

All features and decisions require checkbox approval:

```markdown
- [ ] Feature name    # Awaiting approval
- [x] Feature name    # Approved (user only can check)
```

**Only the user can check boxes**. Claude proposes, user approves.

## Document Writing Guidelines

### Requirements Documents
- Use table format with columns: Requirement ID, Requirement Name, Function ID, Function Name, Description, Required Data, Optional Data, Approval
- Function names are nouns (e.g., "회원가입", not "회원가입하기")
- Descriptions use format: "사용자가 ~한다" (User does ~)
- Non-technical language (understandable by non-developers)

### API Documents
- Table format: Function ID, Method, Endpoint, Request, Response, Auth, Notes
- Swagger will handle detailed types/validation
- Error codes defined during Stage 6 implementation
- 2-layer response structure: HTTP Layer + Data Layer

### Technology Stack Documents
- Part 1: Language and core framework selection
- Part 2: Feature-specific library research and selection
- **Web search required** for each library
- Document ALL candidates with pros/cons (including rejected options)
- Specify versions
- Include reasons for selection/rejection

### Open Questions Management
When resolving a question:
1. Check the chosen option
2. Record decision with date
3. Update all related documents
4. Add any new TODOs to `roadmap.md`
5. Delete the question from `open-questions.md`

## Current Project State

Based on the repository status:
- Project is in **initial setup phase**
- Only `PROJECT-RULES.md` exists in `documents/`
- No planning documents created yet
- No source code exists
- Language: Korean (all documentation and communication should be in Korean)
- .gitignore configured for Python projects

## When Starting Work

1. **First**: Read the latest `documents/PROJECT-RULES.md` (it's the source of truth)
2. **Second**: Check if any planning documents exist and read them
3. **Third**: Ask the user what stage they want to work on
4. **Never**: Start coding without completed and approved planning documents

## Git Workflow

- Commit after each significant document update
- Commit messages should describe what was added/changed
- All progress is tracked through Git history (no change logs in documents)
- Documents are always kept in their current state (use Git to see history)

## Language

All documentation, file names, and communication should be in **Korean** (한국어), as this is the project's working language.
