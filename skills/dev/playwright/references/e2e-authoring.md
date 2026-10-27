> **Read this when:** Writing, adding, or reviewing a Playwright end-to-end test or user journey, or creating a new Playwright suite.

# Author end-to-end tests

Load `test` and its browser/E2E reference for behavior, boundary, and evidence decisions.
Use this reference to express that contract through Playwright Test, not to move every
check into the browser. Detect the resolved version first; for a new suite, record the
chosen stable target before using version-sensitive APIs.

## Turn a journey into an independent spec

1. Name the actor, starting state, public action, and observable result. Give the test a
   behavior name, not an implementation name. Keep one coherent scenario per test; use
   several assertions when they establish the same outcome.
2. Inspect the existing fixture export and import `test` and `expect` from that owner.
   Use `@playwright/test` directly only when no project fixture layer is required.
3. Create prerequisites through the narrowest supported setup interface. The `request`
   fixture or a domain fixture can seed real records without repeating irrelevant UI
   setup. Give each test attempt unique identities and a bounded cleanup lifecycle;
   browser contexts do not reset backend data.
4. Exercise the behavior through the browser using semantic locators and awaited
   actions. Load `interaction-and-readiness.md` for locators, web-first assertions, and
   behavior-specific synchronization. Use `test.step` when named business phases make
   a longer journey easier to diagnose, not for every click.
5. Assert the consumer-visible result. If persistence is the claim, observe it after
   reload or through an independent read, not only through an optimistic success toast.
   For rejected actions, assert the meaningful error and the absence of the forbidden
   outcome at the relevant boundary.
6. Release owned resources through fixtures or failure-safe teardown. Run the focused
   spec, then the affected project/suite. Probe repeatability and intended concurrency
   when setup, accounts, or timing changed; one green retry is not stability evidence.

**Complete when:** the spec can start alone with fresh state, reaches the claimed real
boundary, and fails when the user-visible contract is broken.

## Keep setup from replacing the behavior

API setup is a shortcut for prerequisites, not evidence of a UI workflow. Reusing
`storageState` is appropriate for a test of an already-authenticated task; a test of
login itself must exercise login. Likewise, seeding an order cannot prove that checkout
creates an order.

Keep owned backend, authorization, and persistence paths real when they are part of the
claim. Control unrelated third-party responses through narrow routes when the test is
about the app's handling of those responses; keep separate integration evidence when
the third-party protocol is the requirement. Label a mocked browser/client test as such
rather than claiming full-stack E2E coverage. Load `network-and-isolation.md` whenever
routing or external state applies.

## Example: saving survives reload

This illustrative app has an accessible name field and a Save button.
It assumes `baseURL` is configured and the imported project's automatic account fixture
supplies a unique, authenticated account plus failure-safe teardown. Adapt the fixture and UI contract to
the repository; the example does not create an account or define the app's routes.

```ts
import { test, expect } from './fixtures';

test('saved display name survives reload', async ({ page }) => {
  await page.goto('/settings/profile');
  await page.getByRole('textbox', { name: 'Display name', exact: true }).fill('Robin');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Profile saved');

  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Display name', exact: true })).toHaveValue(
    'Robin',
  );
});
```

The awaited confirmation represents this app's save-completion contract; the reload
checks that the value is not merely local UI state. If the app can display cached data
after reload, use an independent server read or fresh session to establish persistence.
The fixture owns authentication/data lifecycle; this test owns the profile-edit journey.
Do not introduce a page-object class or route mock solely to shorten this example.

## Control relevant nondeterminism

Use explicit locale, timezone, viewport, permissions, and known data when they affect
the outcome. Keep those choices in the appropriate project or `use` configuration;
avoid multiplying projects for irrelevant combinations.

For browser timers or dates, use the installed version's Clock APIs instead of waiting
real minutes. Install the clock before navigation or code that uses the controlled
timers. Choose fixed time versus advancing timers from the behavior being tested.
Browser clock control does not change server time, scheduled jobs, or database expiry;
those need their own authorized setup or observation.

For screenshots or accessibility snapshots, load `diagnostics-and-scale.md`. A large
snapshot is not a substitute for targeted functional assertions.

## Official sources

- [Best practices](https://playwright.dev/docs/best-practices)
- [Writing tests](https://playwright.dev/docs/writing-tests)
- [API setup and testing](https://playwright.dev/docs/api-testing)
- [Fixtures](https://playwright.dev/docs/test-fixtures)
- [Authentication](https://playwright.dev/docs/auth)
- [Clock](https://playwright.dev/docs/clock)
- [Context configuration](https://playwright.dev/docs/test-use-options)
