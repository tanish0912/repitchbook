# 🔥 Repitchbook 2.0 — Prototype Build Spec (Next.js)

## ROLE
You are a **senior product engineer + UX-aware frontend architect** building a **functional prototype**, not a polished SaaS.

Your job is to:
- Build a **working pitch-structure editor**
- Optimize for **clarity, correctness, and editability**
- Avoid premature abstractions or overengineering

---

## OBJECTIVE
Build a **Next.js prototype** that converts structured user inputs into a **consulting-style pitch deck outline**, allows **slide-level editing and reordering**, previews the pitch, and saves drafts locally.

This is a **logic + UX prototype**, not a final product.

---

## NON-GOALS (STRICT)
Do **NOT**:
- Build a design system
- Integrate real market data
- Build PPT export
- Add authentication
- Overuse AI abstractions
- Optimize for performance prematurely

If unsure → **choose the simplest working solution**.

---

## CORE USER FLOW (CRITICAL)
1. User selects **Pitch Type**
2. User fills **guided inputs**
3. System generates **slide outline + content suggestions**
4. User edits slides (title, bullets, notes)
5. User reorders slides
6. User previews presentation
7. User saves draft and can reopen later

Every feature must support this flow.

---

## PITCH TYPES & STRUCTURE RULES

### Pitch Types
```ts
type PitchType = "REAL_ESTATE" | "STARTUP" | "SALES";
```

Each pitch type maps to a **default slide skeleton**:

#### Real Estate
1. Opportunity Overview
2. Location & Context
3. Property Highlights
4. Market Rationale
5. Financial Upside
6. Next Steps

#### Startup
1. Problem
2. Solution
3. Market
4. Product
5. Business Model
6. Traction / Vision

#### Sales Proposal
1. Client Context
2. Pain Points
3. Proposed Solution
4. Value Proposition
5. Pricing / Scope
6. Call to Action

> Slides are **suggestions**, not fixed. Users can edit freely.

---

## INPUT CONTRACT (FORM → GENERATOR)

### Collected Inputs
```ts
{
  pitchTitle: string;
  pitchType: PitchType;
  audience: string;
  goal: string;
  location?: string;
  highlights: string[];
  notes?: string;
}
```

### Generation Rules
- Slide titles must be **short and consulting-style**
- Bullets must be **clear, non-fluffy**
- Speaker notes are optional but helpful
- No slide should exceed **5 bullets**

Mock data is acceptable. AI generation is optional.

---

## DATA MODEL (FINAL)
```ts
type Slide = {
  id: string;
  title: string;
  bullets: string[];
  speakerNotes?: string;
};

type Pitch = {
  id: string;
  createdAt: string;
  pitchType: PitchType;
  pitchTitle: string;
  audience: string;
  goal: string;
  location?: string;
  highlights: string[];
  notes?: string;
  slides: Slide[];
};
```

---

## STATE MANAGEMENT RULES
- Use **Zustand or equivalent**
- Editor state must support:
  - Select slide
  - Update title
  - Add / edit / delete bullets
  - Reorder slides
  - Toggle preview mode
- State must be **serializable** for localStorage

---

## EDITOR UX REQUIREMENTS

### Layout
- **Left panel**: Slide list
  - Shows slide title
  - Drag & drop reorder
- **Right panel**: Editor
  - Editable title
  - Bullet list editor
  - Speaker notes textarea
- **Preview mode**:
  - Read-only slide rendering
  - Next / Prev navigation

### UX Rules
- Editing must feel instant
- No modal overload
- Avoid nested complexity
- Prefer keyboard usability where easy

---

## ROUTES (MANDATORY)
| Route | Purpose |
|------|--------|
| `/` | Landing + CTA |
| `/create` | Pitch type + input form |
| `/editor/[pitchId]` | Main editor |
| `/dashboard` | Saved drafts |

---

## STORAGE (MVP)
- Use `localStorage`
- Persist entire `Pitch` object
- Load on dashboard
- Support delete

No backend required.

---

## IMPLEMENTATION STRATEGY

### Step 1 — Plan
- File structure
- Core components
- Global state shape

### Step 2 — Generate
- Build generation logic (mock or AI)
- Deterministic enough for demos

### Step 3 — Editor
- Slides list
- Slide editor
- Preview mode

### Step 4 — Persistence
- Save / load drafts
- Dashboard listing

---

## QUALITY BAR
- Readable code
- Explicit naming
- No unused abstractions
- Demo-ready in **5 minutes**

---

## FINAL RULE
If any feature threatens clarity or timeline:

👉 **Cut it. Simpler wins.**
