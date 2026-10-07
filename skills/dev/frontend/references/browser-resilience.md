> **Read this when:** implementing loading, empty, error, pending, disabled, or
> recovery states; using browser APIs; handling touch, keyboard, motion, storage, or
> cross-browser behavior.

# Browser Resilience

Define the complete user workflow before polishing its happy path. The frontend skill
owns the expected browser behavior; use `agent-browser` to exercise and capture that
behavior when browser access is available.

## State matrix

For each asynchronous or destructive workflow, account for applicable states:

- initial and ready;
- loading or navigation pending;
- empty;
- validation or request error;
- success;
- retry or recovery;
- disabled or blocked while work is in flight;
- stale data or interrupted connectivity.

Use one clear feedback mechanism for one event. Preserve user input when a recoverable
submission fails. Prevent duplicate writes while keeping cancellation or navigation
behavior understandable.

## Input and motion

- Support keyboard, pointer, and touch according to the control's semantics.
- Keep touch targets usable and avoid hover-only functionality.
- Read reduced-motion preferences at the point behavior runs so session changes can be
  respected.
- Preserve focus and scroll position intentionally across updates and navigation.

## Browser APIs and persistence

- Check support and failure modes before calling optional browser APIs.
- Keep storage data minimal, versioned, and non-sensitive.
- Treat storage, postMessage payloads, clipboard input, and URL data as untrusted.
- Clean up subscriptions, observers, timers, and global listeners.
- Prefer progressive enhancement when the core workflow can work without an optional
  capability.

## Verification with agent-browser

Invoke the installed `agent-browser` skill rather than copying its command reference.
Verify the primary path and at least one failure or recovery path. Capture only evidence
that bears on the task: semantic state, console/page errors, screenshot, trace, or video.

**Complete when:** the state matrix is accounted for, relevant input modes work, browser
resources are cleaned up, optional APIs fail safely, and observed behavior matches the
expected contract.
