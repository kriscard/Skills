> **Read this when:** user asks why code is hard to maintain, wants to identify what to refactor, or asks when/whether to refactor.

# Code Smells & Refactoring Signals

Adapted from Fowler's *Refactoring* — curated for frontend/fullstack work. No class-hierarchy framing; examples use components, hooks, and modules.

---

## Architecture-Level Smells (Wrong Boundaries)

These smells signal that something is in the wrong place — wrong module, wrong abstraction, wrong ownership. Fix the structure before fixing the code.

### 1. Shotgun Surgery
**What:** A single logical change requires edits across many unrelated files.
**Signal:** "I added a new user role and had to update 8 files."
**Cause:** Logic that belongs together is spread across the codebase.
**Fix:** Move all related logic into one module. The goal: one change = one file changed.

### 2. Divergent Change
**What:** One module changes for many unrelated reasons.
**Signal:** `userUtils.ts` gets touched for auth changes, display formatting, API mapping, and validation.
**Cause:** SRP violation — the module has multiple responsibilities.
**Fix:** Split by responsibility. `userAuth.ts`, `userDisplay.ts`, `userApi.ts`.

### 3. Feature Envy
**What:** A function or hook is more interested in another module's data than its own.
**Signal:** `useCheckout` spends most of its logic reading from `useCart` and `useUser` directly.
**Cause:** The logic is in the wrong module.
**Fix:** Move the logic to where the data lives, or extract a new module that owns both.

### 4. Inappropriate Intimacy
**What:** Two modules know too much about each other's internal implementation.
**Signal:** `CheckoutPage` imports and directly calls internal methods of `CartStore`.
**Cause:** Missing interface — direct coupling to internals instead of the public API.
**Fix:** Define a clean interface. `CartStore` exposes only what consumers need; `CheckoutPage` uses only that.

### 5. Middle Man
**What:** A module does nothing but delegate to another module.
**Signal:** `useCartItems` just calls `useCartStore` and returns the result without transformation.
**Cause:** Over-abstraction — the layer adds no value.
**Fix:** Remove the middle man and call the underlying module directly. (Exception: if the indirection makes testing significantly easier, it may be worth keeping.)

---

## Component / Hook-Level Smells

### 6. Long Component
**What:** A component over ~150 lines that mixes rendering, data fetching, and business logic.
**Signal:** You scroll through a component to understand any single behavior.
**Fix:** Split by concern. Extract data fetching to a hook. Extract sub-sections as child components.

### 7. Long Parameter List
**What:** A function or hook with more than 4–5 parameters.
**Signal:** `useForm(fieldName, defaultValue, validators, onSubmit, formatters, options)`
**Cause:** Multiple concerns bundled together, or a growing API without design.
**Fix:** Consolidate into an options object. Split the function if parameters represent different concerns.

### 8. Data Clumps
**What:** The same 3–4 props always appear together across components and function calls.
**Signal:** Every function that deals with a user takes `(userId, userName, userEmail, userRole)`.
**Cause:** Related data that hasn't been modeled as a unit.
**Fix:** Extract into a type/interface: `User`. Pass the object.

### 9. Prop Drilling
**What:** Passing props more than 2 levels deep to reach a consumer.
**Signal:** `App → Layout → Sidebar → Nav → NavItem` — and `NavItem` needs `currentUser` that was defined in `App`.
**Cause:** State is defined too high up, or the wrong component owns it.
**Fix:** Lift state to Context if many components need it, or use a state manager. Ask first: does this state actually need to be this high?

### 10. Dead Code
**What:** Unused components, hooks, utilities, types, or commented-out code.
**Signal:** A component that's imported nowhere. A utility function no one calls.
**Fix:** Delete it. Version control remembers it. Dead code raises cognitive load for every reader.

---

## Data / Type Smells

### 11. Primitive Obsession
**What:** Using primitives (strings, numbers) for values that have domain meaning and constraints.
**Signal:** `userId: string`, `orderId: string`, `productId: string` — all the same type, but mixing them is a bug.
**Fix:** Use branded types or nominal types:
```ts
type UserId = string & { __brand: 'UserId' }
type OrderId = string & { __brand: 'OrderId' }
// Now TypeScript prevents: fn(orderId as UserId)
```

### 12. Parallel Arrays
**What:** Two or more arrays that must always stay in sync index-by-index.
**Signal:** `const ids = ['a', 'b']` and `const labels = ['Alpha', 'Beta']` — callers must know they're aligned.
**Cause:** Data that belongs together was split.
**Fix:** Replace with an array of objects: `[{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }]`.

---

## When to Refactor (Fowler's 4 Types)

**Preparatory** — Before adding a feature, refactor to make the feature easy.
> "What would make this change trivial?" Refactor that first. Then add the feature.

**Comprehension** — While reading code you need to understand, refactor to clarify.
> Rename the confusing variable. Extract the cryptic expression. Flatten the nested conditional. Leave it easier to read than you found it.

**Litter-pick** — While passing through code for another reason, fix the small thing.
> If it takes < 5 minutes, fix it now. If it takes longer, note it and come back with dedicated time.

**Planned** — Dedicated refactor time blocked on the calendar.
> If you never plan it, it never happens. Technical debt has compounding interest.

**The rule:** never mix refactoring with feature work in the same commit. Refactoring changes structure; features change behavior. Mixed commits make bugs hard to isolate and history hard to read.

---

## Refactoring Techniques Mapped to Smells

| Smell | Technique |
|-------|-----------|
| Shotgun Surgery | Extract Module, Move Function |
| Divergent Change | Extract Module, Split by responsibility |
| Feature Envy | Move Function to the module that owns the data |
| Inappropriate Intimacy | Define interface, Extract API boundary |
| Long Component | Extract Component, Extract Hook |
| Long Parameter List | Introduce Options Object, Extract Type |
| Data Clumps | Extract Type/Interface |
| Prop Drilling | Lift to Context, Introduce State Manager |
| Primitive Obsession | Introduce Branded Type |
| Parallel Arrays | Replace with Array of Objects |
