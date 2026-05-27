> **Read this when:** user asks about code organization, module design, or why a codebase feels hard to change.

# Design Principles

## Ousterhout's Complexity Model

Complexity is the root cause of most software problems. It accumulates gradually through small, reasonable-seeming decisions.

**3 symptoms of complexity:**
- **Change amplification** — a single logical change requires edits in many places. Signal: "I have to update 6 files every time I add a new field."
- **Cognitive load** — developer must hold too much context to work safely. Signal: "You can't touch this without knowing all these things first."
- **Unknown unknowns** — it's not obvious what must change when something else changes. Signal: "We didn't know that also affected X." (The most dangerous symptom.)

**2 causes:**
- **Dependencies** — code can't be understood or changed in isolation
- **Obscurity** — important information isn't obvious from the code

**Deep modules** — the ideal: simple interface hiding complex implementation. The ratio of interface cost to benefit should be small.

**Shallow modules** — the anti-pattern: class or function with a trivial body that adds interface overhead without hiding meaningful complexity. Passthrough methods, wrapper classes that do nothing, tiny utility files are all shallow modules.

**Information hiding** — each module should make its internal design decisions invisible to the rest of the system. If callers know how a module works internally, the module isn't actually encapsulating anything.

**Pull complexity downward** — better for a module to have a complex implementation than a complex interface. If you can't hide the complexity, at least centralize it.

**Define errors out of existence** — redesign APIs to eliminate error cases rather than propagating them to callers. Example: instead of throwing on an empty input, return a sensible default.

**Tactical vs strategic programming:**
- Tactical: take the fastest path to working code today. Each shortcut feels small, but complexity compounds.
- Strategic: invest 10–15% of time in keeping the system clean. Slower initially, significantly faster after 6 months.
- Most codebases drift tactical over time. The switch to strategic is a deliberate team decision.

---

## SOLID Principles (Applied to Frontend)

All 5 apply — calibrate the depth to the problem. S and D are felt most in frontend work.

**S — Single Responsibility**
A module/component should have one reason to change.
- Violation: a React component that changes when the form validation logic changes AND when the visual design changes AND when the API response shape changes.
- Fix: split into a container (data/logic) and a presentational component (display only). Extract validation to a hook. Map API responses at the boundary, not inside the component.

**O — Open/Closed**
Open for extension, closed for modification.
- Violation: every new payment type requires editing an existing `switch` statement inside `PaymentProcessor`.
- Fix: Strategy pattern — inject the payment handler. Adding a new type doesn't touch existing code.

**L — Liskov Substitution**
Subtypes must be substitutable for base types without breaking behavior.
- Violation: a subclass throws in a case where the parent contract says it returns a value.
- In TypeScript/React: a component that accepts `ButtonProps` but ignores `disabled` violates the implicit contract. Less common than S/D but critical in typed component hierarchies and hook composition.

**I — Interface Segregation**
No fat interfaces. Clients shouldn't depend on methods/props they don't use.
- Violation: a component receives 15 props but only uses 3. The caller must construct all 15.
- Fix: split prop interfaces. Pass only what the component actually needs. Compose rather than pass everything down.

**D — Dependency Inversion**
High-level modules shouldn't depend on low-level modules. Both should depend on abstractions.
- Violation: a component directly imports and calls a concrete API client (`import { fetchUser } from '../api/users'`).
- Fix: inject the data-fetching dependency via props or context. The component depends on "something that can fetch a user", not on the specific fetch implementation. Enables testing, swapping implementations, and environment-specific behavior.

---

## Additional Principles

**Law of Demeter** — only talk to immediate collaborators.
- Violation: `user.profile.avatar.url` inside a component. The component knows about User, Profile, Avatar, and URL — four layers of coupling.
- Frontend signal: prop drilling, deeply nested state access chains.
- Fix: flatten the interface. Pass `avatarUrl` as a prop. The component knows one thing.

**Hollywood Principle** — "don't call us, we'll call you."
- Framework controls flow; children react via callbacks/events.
- Frontend: React's parent-to-child data flow, event handlers, dependency injection via context. You don't reach up to get data — you receive it.

**Tell, don't ask** — tell objects to perform actions; don't query their state to make decisions outside them.
- Violation: `if (cart.items.length > 0) { cart.checkout() }` — you're asking Cart for data to make a decision that Cart should own.
- Fix: `cart.checkoutIfNotEmpty()` — the decision lives with the data.
- Frontend: business logic belongs in hooks/state, not scattered across components.

**DRY (Don't Repeat Yourself)**
- Violation: the same filtering logic copy-pasted across 3 components.
- Fix: extract to a custom hook or utility. One source of truth.
- Caveat: duplication is cheaper than the wrong abstraction. DRY two things only when they're actually the same concept, not just currently similar.

**YAGNI (You Aren't Gonna Need It)**
- Violation: adding a plugin system "for future flexibility" with no concrete use case.
- Fix: delete it. Build when there's a real need. Speculative abstractions become maintenance debt.

**KISS (Keep It Simple)**
- Violation: 4 layers of abstraction wrapping a 3-line operation.
- Fix: inline it. The cost of complexity must be justified by the benefit of the abstraction.

**Composition over Inheritance**
- Inheritance creates tight coupling and fragile hierarchies.
- Frontend: custom hooks instead of class-based HOCs, render props instead of deep component inheritance, composing small hooks into larger ones.
- Rule: if you're tempted to extend a component or hook, compose it instead.
