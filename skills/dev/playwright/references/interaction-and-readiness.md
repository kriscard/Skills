> **Read this when:** Writing or reviewing Playwright locators, actions, assertions, waits, navigation readiness, timeouts, or page/helper abstractions.

# Interaction and readiness

## Locators express the contract

Prefer locators in this order, adjusted to the product contract:

1. accessible role plus accessible name for interactive UI;
2. label, placeholder, text, alt text, or title when that is how a user identifies it;
3. an explicit test id when user-facing semantics are ambiguous or unstable;
4. CSS only for a stable implementation contract that cannot be expressed above;
5. XPath only when repository evidence makes it unavoidable.

Use chaining and filtering to scope within a meaningful region. Let strictness expose
ambiguity. `first()`, `last()`, and `nth()` are justified only when order itself is the
contract; they are not a routine fix for multiple matches. Prefer locator-based actions
over element handles so Playwright can resolve the current element and apply
retry/actionability behavior.

## Actions and assertions

Rely on actionability checks for interaction and web-first assertions for outcomes.
Assert what the user or integration observes: visible content, enabled controls, URL,
download, popup, response, or durable state. Avoid immediate value reads followed by
non-retrying assertions when a locator assertion can observe the eventual outcome.

Force an action only when the test intentionally covers behavior that bypasses normal
user actionability. A forced click is not a general repair for overlays, disabled state,
an animation, or a wrong locator.

## Readiness signals

Wait for the narrow signal caused by the action:

- locator state or a web-first assertion for UI readiness;
- `waitForURL` or a URL assertion for navigation identity;
- a response/request predicate when the network event is the contract;
- popup, download, dialog, or event promises started before the triggering action;
- an application-specific marker when hydration or background work has a stable public
  signal.

Most actions already auto-wait, so add explicit waiting only for a signal outside that
action's built-in contract. Playwright officially discourages `networkidle` for testing;
ongoing analytics, streaming, polling, and service workers make network silence a poor
proxy for user readiness. Fixed `waitForTimeout` sleeps are for diagnosis only.

## Timeouts

Diagnose which budget expired before increasing it: test, expect, action, navigation,
fixture, or global timeout. Increase the narrow budget only when the operation has a
legitimate measured duration. A blanket timeout increase can hide a missing signal,
blocked request, incorrect base URL, or overloaded CI worker.

## Helpers and page objects

Start with readable specs, fixtures for capabilities, and small domain helpers. Introduce
a page/component object only when repeated workflows or locator knowledge form a
coherent interface whose encapsulation reduces real change cost. Keep assertions near
the behavior unless the abstraction owns a reusable semantic outcome. Avoid one class
per route, inheritance trees, and wrappers that merely rename Playwright methods.

## Failure signals

Common smells:

- long CSS/XPath chains or locator ambiguity hidden by `nth()`;
- sleeps after actions;
- `networkidle` used as generic readiness;
- force-clicking through a broken UI state;
- assertions on implementation details rather than visible behavior;
- shared helper state or page objects that retain a `page` across tests;
- increasing timeouts without identifying the blocked signal.

## Official sources

- [Locators](https://playwright.dev/docs/locators)
- [Auto-waiting and actionability](https://playwright.dev/docs/actionability)
- [Assertions](https://playwright.dev/docs/test-assertions)
- [`page.waitForLoadState`](https://playwright.dev/docs/api/class-page#page-wait-for-load-state)
