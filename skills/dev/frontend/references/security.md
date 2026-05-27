> **Priority: CRITICAL** — Security issues are the only category where "works
> correctly" and "safe" are separate bars. XSS via `dangerouslySetInnerHTML`,
> tokens in `localStorage`, missing CSP — these ship silently, cause production
> incidents, and can't be fixed retroactively for affected users. Apply this
> reference before any other; no optimization matters if the app is insecure.
>
> **Read this when:** the user mentions XSS, `dangerouslySetInnerHTML`,
> DOMPurify, CSP headers, input sanitization, `localStorage` security,
> auth tokens, JWT storage, `httpOnly` cookies, CORS, third-party scripts,
> integrity attributes, or frontend security in general.
>
> **Not the right file?** TypeScript runtime validation at API boundaries →
> `type-system.md`. Next.js Server Actions authentication → `nextjs.md`.

# Frontend Security

## XSS Prevention in React / JSX

React's JSX escapes all string values by default. The only way to introduce XSS
in React is to deliberately bypass that escaping.

### `dangerouslySetInnerHTML` — use only as last resort

```typescript
// ❌ Direct HTML from user input — XSS vector
function Comment({ content }: { content: string }) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

// ✅ Sanitize with DOMPurify before injecting
import DOMPurify from 'dompurify';

function Comment({ content }: { content: string }) {
  const clean = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    FORCE_BODY: true,
  });
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

**DOMPurify caveats:**
- Always use an allowlist (`ALLOWED_TAGS`), never a denylist
- Set `ADD_ATTR: ['target']` + `FORCE_ADD_ATTR: ['rel']` if allowing `<a
  target="_blank">` (otherwise DOMPurify strips `rel`)
- SSR: DOMPurify requires a real DOM. Use `isomorphic-dompurify` for
  server-side use, or sanitize server-side only and mark the result as trusted.

### Trusted Types (emerging standard)

```typescript
// next.config.ts — enable Trusted Types policy
const ContentSecurityPolicy = `
  require-trusted-types-for 'script';
  trusted-types dompurify nextjs;
`;
```

Trusted Types force all DOM sinks (`innerHTML`, `script.src`, etc.) through a
policy function, making XSS injection a compile-time/linting error rather than
a runtime surprise. Browser support is good (Chromium-based); Firefox behind a
flag as of 2025.

---

## Content Security Policy (CSP)

CSP is a defense-in-depth layer: even if XSS occurs, CSP limits what the
injected script can do.

### Nonce-based CSP (recommended for Next.js)

A random nonce on each request allows your own `<script>` tags while blocking
injected ones:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export function middleware(req: Request) {
  const nonce = crypto.randomBytes(16).toString('base64');
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonce}'`,
    `img-src 'self' data: https:`,
    `connect-src 'self' https://api.yourdomain.com`,
    `font-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ].join('; ');

  const res = NextResponse.next();
  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('x-nonce', nonce); // pass to next.config to add to <script> tags
  return res;
}
```

### CSP gotchas

- `'unsafe-inline'` defeats most XSS protection. Avoid it.
- `'strict-dynamic'` lets nonce-allowlisted scripts load further scripts, which
  is required for bundlers. Requires modern browsers.
- Start in report-only mode: `Content-Security-Policy-Report-Only` with a
  `report-uri` endpoint to catch violations before enforcing.

---

## Input Sanitization

### Server-side is the real sanitization; client-side is UX polish

Never trust client-side sanitization for security decisions. A request to your
API will not go through your React component.

```typescript
// Server (Node.js / Next.js API route / Server Action)
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

const CommentSchema = z.object({
  body: z.string().max(5000).transform(v => DOMPurify.sanitize(v)),
  postId: z.string().uuid(),
});

// Client-side: validate for UX (immediate feedback), not for security
```

---

## Client-Side Storage Security

### What to store where

| Data | `localStorage` | `sessionStorage` | `httpOnly` Cookie |
|---|---|---|---|
| Theme preference | ✅ | ✅ | — |
| Non-sensitive cache | ✅ | ✅ | — |
| Access tokens | ❌ | ❌ | ✅ |
| Refresh tokens | ❌ | ❌ | ✅ (Secure, SameSite=Strict) |
| User PII | ❌ | ❌ | — (don't store) |

**Why `localStorage` is wrong for tokens:** XSS can read `localStorage`
directly. A compromised npm dependency, a CSP violation, or a single
`dangerouslySetInnerHTML` mistake gives an attacker your users' access tokens.

**`httpOnly` cookies** can't be read by JavaScript at all. They're attached
automatically to requests (including CORS preflight). Pair with `Secure` (HTTPS
only) and `SameSite=Strict` (or `Lax` if you need cross-site links).

```typescript
// Setting an httpOnly auth cookie from a Next.js Route Handler
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const { token } = await authenticate(req);
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return new Response(null, { status: 204 });
}
```

### If you must use localStorage (non-auth data)

```typescript
// Version your data to survive schema changes
interface StoredData<T> {
  version: number;
  data: T;
  timestamp: number;
}

function getStoredData<T>(key: string, schema: z.ZodType<T>, currentVersion: number): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed: StoredData<T> = JSON.parse(raw);
    if (parsed.version !== currentVersion) {
      localStorage.removeItem(key); // stale — discard
      return null;
    }
    return schema.parse(parsed.data); // runtime validation
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}
```

---

## CORS Configuration

### Never use wildcard `*` for credentialed requests

```typescript
// ❌ Wildcard — can't be used with credentials: 'include'
Access-Control-Allow-Origin: *

// ✅ Allowlist specific origins
const ALLOWED_ORIGINS = new Set([
  'https://app.yourdomain.com',
  'https://admin.yourdomain.com',
]);

// next.config.ts headers or middleware
export function corsHeaders(origin: string | null) {
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin', // required — tells CDN to cache per origin
  };
}
```

### Preflight handling

```typescript
// Handle OPTIONS preflight in Route Handlers
export async function OPTIONS(req: Request) {
  const origin = req.headers.get('Origin');
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}
```

---

## Third-Party Script Risks

Every third-party script you load has full access to your DOM, cookies
(non-httpOnly), and `localStorage`. Treat them as code you wrote.

### Subresource Integrity (SRI)

Ensures the script file hasn't been tampered with at the CDN:

```html
<script
  src="https://cdn.example.com/lib.min.js"
  integrity="sha384-<base64-hash>"
  crossorigin="anonymous"
></script>
```

Generate hashes: `openssl dgst -sha384 -binary lib.min.js | openssl base64 -A`

**Caveat:** SRI fails if the CDN serves a different file per request (e.g.,
versioned URLs). Only use with pinned, immutable URLs.

### Sandboxing iframes

For embedded content, restrict what the iframe can do:

```html
<iframe
  src="https://widget.example.com"
  sandbox="allow-scripts allow-same-origin"
  loading="lazy"
  title="Embedded widget"
/>
```

`sandbox` without `allow-same-origin` prevents the iframe's JS from accessing
the parent origin. `allow-same-origin` is needed for the iframe to read its own
cookies/storage — don't add it unless required.

### Next.js `<Script>` strategy

```typescript
import Script from 'next/script';

// Load after page is interactive (analytics, chat widgets)
<Script src="https://widget.example.com/chat.js" strategy="lazyOnload" />

// Load as soon as possible (critical A/B testing)
<Script src="https://cdn.example.com/ab.js" strategy="beforeInteractive" />
```

---

## Security Headers Checklist

Add these to every production deployment:

```typescript
// next.config.ts
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];
```

Validate with [securityheaders.com](https://securityheaders.com) before going live.

---

## Further Reading

- [OWASP Top 10 — XSS](https://owasp.org/www-community/attacks/xss/)
- [MDN — CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [DOMPurify](https://github.com/cure53/DOMPurify)
- [Trusted Types](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)
- [web.dev — same-site cookies](https://web.dev/articles/samesite-cookies-explained)
