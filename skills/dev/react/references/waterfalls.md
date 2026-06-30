> **Read this when:** the user mentions sequential awaits, waterfalls, parallel
> fetching, "why is this slow", Suspense streaming, `React.cache`, `after()`,
> or data fetching chains in React/Next.js.
>
> **Not the right file?** If the issue is a `useEffect` smell →
> `useeffect-antipatterns.md`. If the issue is rendering model choice →
> `rendering-models.md`.

> **Priority: CRITICAL** — Waterfalls add hundreds of milliseconds to every page
> load and compound with each nested request. A single sequential `await` where
> `Promise.all` would work doubles the time to data. Fix waterfalls before
> re-render or JS performance optimizations — the impact ratio is orders of
> magnitude higher.
>

# Waterfalls and Parallel Fetching

A waterfall happens when request B cannot start until request A completes, even
though B does not actually need A's result. The fix is almost always
`Promise.all` or RSC composition with Suspense.

---

## Detection: Is This a Waterfall?

Look for sequential `await` statements. For each one, ask: *"Does the second
await actually use the result of the first?"*

```typescript
// Waterfall — posts does NOT need user's data to start
const user = await getUser(id);         // 200ms
const posts = await getUserPosts(id);   // 200ms — starts AFTER user resolves
// Total: ~400ms

// Parallel — both start at the same time
const [user, posts] = await Promise.all([
  getUser(id),       // 200ms
  getUserPosts(id),  // 200ms, starts in parallel
]);
// Total: ~200ms (the slower of the two)
```

**Exception:** if the second call genuinely needs the first result:
```typescript
const user = await getUser(id);
const org = await getOrg(user.orgId); // ✅ can't parallelize — needs user.orgId
```

---

## Promise.all for Independent Fetches

```typescript
// ❌ Sequential — common mistake
export default async function ProfilePage({ params }: { params: { id: string } }) {
  const user = await db.users.findUnique({ where: { id: params.id } });
  const posts = await db.posts.findMany({ where: { authorId: params.id } });
  const followers = await db.follows.count({ where: { followedId: params.id } });

  return <Profile user={user} posts={posts} followers={followers} />;
}

// ✅ Parallel — all three start simultaneously
export default async function ProfilePage({ params }: { params: { id: string } }) {
  const [user, posts, followers] = await Promise.all([
    db.users.findUnique({ where: { id: params.id } }),
    db.posts.findMany({ where: { authorId: params.id } }),
    db.follows.count({ where: { followedId: params.id } }),
  ]);

  return <Profile user={user} posts={posts} followers={followers} />;
}
```

---

## Promise.allSettled — When Partial Failure Is OK

```typescript
// If one source is optional / non-critical, allSettled prevents one failure
// from blocking the others
const [userResult, postsResult] = await Promise.allSettled([
  getUser(id),
  getPosts(id),
]);

const user = userResult.status === 'fulfilled' ? userResult.value : null;
const posts = postsResult.status === 'fulfilled' ? postsResult.value : [];
```

---

## Suspense Streaming — Stream Independent Data as It Resolves

With RSC and Suspense, you can send the page shell immediately and stream in
slow data as it resolves, rather than waiting for all data before sending
anything.

```typescript
// app/profile/[id]/page.tsx
import { Suspense } from 'react';

export default function ProfilePage({ params }: { params: { id: string } }) {
  return (
    <>
      <ProfileHeader userId={params.id} /> {/* Streams in fast */}
      <Suspense fallback={<PostsSkeleton />}>
        <UserPosts userId={params.id} />   {/* Streams in when ready */}
      </Suspense>
      <Suspense fallback={<FollowersSkeleton />}>
        <FollowerCount userId={params.id} /> {/* Streams in when ready */}
      </Suspense>
    </>
  );
}

// UserPosts and FollowerCount are async RSC components —
// they fetch their own data without blocking each other or the shell
async function UserPosts({ userId }: { userId: string }) {
  const posts = await db.posts.findMany({ where: { authorId: userId } });
  return <PostList posts={posts} />;
}
```

**Why it matters:** The shell (header, nav, layout) appears immediately. Slow
components appear as they resolve — no waterfall between the fast and slow parts.

---

## RSC Component Composition — Avoid Prop Drilling Data Down

A common pattern that accidentally creates waterfalls: fetching all data in the
root and passing it down as props.

```typescript
// ❌ Root fetches everything sequentially (or even in parallel), but
//    children must wait for the root to finish before rendering
export default async function Page({ params }) {
  const [user, posts, comments] = await Promise.all([...]);
  return <Layout user={user} posts={posts} comments={comments} />;
}

// ✅ Each component fetches its own data — Suspense handles streaming
export default function Page({ params }) {
  return (
    <Suspense fallback={<UserHeaderSkeleton />}>
      <UserHeader userId={params.id} />     {/* fetches user */}
    </Suspense>
    <Suspense fallback={<PostsSkeleton />}>
      <Posts userId={params.id} />           {/* fetches posts */}
    </Suspense>
    <Suspense fallback={<CommentsSkeleton />}>
      <Comments postId={params.postId} />    {/* fetches comments */}
    </Suspense>
  );
}
```

---

## React.cache() — Dedup the Same Call Across the RSC Tree

When multiple RSC components in the same request need the same data, `React.cache`
ensures the database is only hit once:

```typescript
// lib/data.ts
import { cache } from 'react';

// Without cache: every RSC that calls getUser(id) hits the DB separately
// With cache: the result is memoized for the duration of the request
export const getUser = cache(async (id: string) => {
  return db.users.findUnique({ where: { id } });
});

// Both components call getUser(id) — only one DB query per request
async function ProfileHeader({ userId }: { userId: string }) {
  const user = await getUser(userId); // DB hit
  ...
}

async function ProfileSidebar({ userId }: { userId: string }) {
  const user = await getUser(userId); // Cache hit — no DB query
  ...
}
```

**Scope:** `React.cache()` is per-request, not per-process. It resets on each
new request, so there's no cross-user data leakage.

---

## after() — Non-Blocking Post-Response Work

`after()` (Next.js 15+, `next/server`) schedules work to run after the response
is sent. Use it for analytics, emails, and logging that shouldn't delay the user.

```typescript
import { after } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const post = await db.posts.create({ data });

  // Runs after response is sent — doesn't add to TTFB
  after(async () => {
    await sendNewPostEmail(post.authorId, post.id);
    await analytics.track('post_created', { postId: post.id });
    await updateSearchIndex(post.id);
  });

  return Response.json(post, { status: 201 });
}
```

**Why:** Email sending and search indexing are not user-facing. Running them
before the response adds 100–500ms to every create operation. `after()` removes
them from the critical path entirely.

---

## Client-Side Waterfall: useEffect Fetch Chains

On the client, useEffect fetches that depend on state set by a previous fetch
create the same problem:

```typescript
// ❌ Three network round-trips before any data renders
function Profile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  useEffect(() => {
    if (user) fetchPosts(user.id).then(setPosts); // waits for user
  }, [user]);
```

```typescript
// ✅ TanStack Query with parallel queries — both start on mount
function Profile({ userId }: { userId: string }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  const { data: posts } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchPosts(userId),
    // No dependency on user — userId is enough to start fetching
  });
}
```

---

## Checklist for Waterfall Audit

- [ ] Any sequential `await` where the second call doesn't use the first result?
  → Replace with `Promise.all`
- [ ] Root RSC fetching all data before children can render?
  → Split into per-component fetches with Suspense boundaries
- [ ] Same fetch called in multiple RSC components?
  → Wrap with `React.cache()`
- [ ] Post-response side effects (email, analytics) in the critical path?
  → Move to `after()`
- [ ] Client `useEffect` chains where fetch B starts only after state from fetch A is set?
  → Use TanStack Query with independent query keys

---

## Further Reading

- [Next.js — Data Fetching Patterns](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns)
- [React docs — Suspense](https://react.dev/reference/react/Suspense)
- [TkDodo — Parallel Queries](https://tkdodo.eu/blog/parallel-queries-in-react-query)
