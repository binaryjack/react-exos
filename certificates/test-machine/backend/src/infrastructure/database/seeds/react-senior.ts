import type { QuestionInput } from '../../domain/question/question.schema.js'

type Difficulty = 'easy' | 'medium' | 'hard'
type QuestionSeed = Omit<QuestionInput, 'technologyId' | 'difficulty'> & { difficulty: Difficulty }

export const reactSeniorQuestions: QuestionSeed[] = [
  // ── Concurrent Features ───────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'Concurrent Features',
    subtopic: 'useTransition',
    type: 'mcq',
    prompt: 'What does `useTransition` allow you to do?',
    options: [
      'Animate component mount/unmount transitions',
      'Mark a state update as non-urgent so it can be interrupted by more urgent updates',
      'Defer network requests until the browser is idle',
      'Batch multiple context updates into one render'
    ],
    answer: 'Mark a state update as non-urgent so it can be interrupted by more urgent updates',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'useTransition returns [isPending, startTransition]. Wrapping state updates in startTransition marks them as transitions — non-urgent updates React can interrupt and de-prioritize when urgent updates (typing, clicking) occur.',
    references: ['https://react.dev/reference/react/useTransition']
  },
  {
    level: 'SENIOR',
    topic: 'Concurrent Features',
    subtopic: 'useDeferredValue',
    type: 'mcq',
    prompt: 'When would you use `useDeferredValue` instead of `useTransition`?',
    options: [
      'When you control the state update — wrap it in startTransition',
      'When you receive a value as a prop or from a hook you don\'t control and want to defer re-renders based on it',
      'When you want to debounce API calls',
      'When dealing with WebGL or Canvas rendering'
    ],
    answer: 'When you receive a value as a prop or from a hook you don\'t control and want to defer re-renders based on it',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'useDeferredValue is the sibling to useTransition. Use useTransition when you own the state update. Use useDeferredValue when you receive a value you cannot control (e.g., from a parent) and want to defer expensive child renders.',
    references: ['https://react.dev/reference/react/useDeferredValue']
  },
  {
    level: 'SENIOR',
    topic: 'Concurrent Features',
    subtopic: 'Suspense',
    type: 'mcq',
    prompt: 'How does Suspense work with data fetching in React 19?',
    options: [
      'You wrap fetch() in Suspense and it automatically shows a fallback',
      'A component suspends by throwing a Promise during render; Suspense catches it and shows fallback until the promise resolves',
      'Suspense only works with React.lazy() — not data fetching',
      'You call suspend() from a hook and React shows the nearest Suspense fallback'
    ],
    answer: 'A component suspends by throwing a Promise during render; Suspense catches it and shows fallback until the promise resolves',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'The Suspense protocol: a component throws a Promise during render. The nearest Suspense boundary catches it, renders the fallback, and re-renders the component tree when the promise settles. Libraries like SWR and React Query implement this.',
    references: ['https://react.dev/reference/react/Suspense']
  },
  {
    level: 'SENIOR',
    topic: 'Concurrent Features',
    subtopic: 'Scheduling',
    type: 'mcq',
    prompt: 'In React concurrent mode, what does "time slicing" mean?',
    options: [
      'Rendering is split across multiple frames so the browser stays responsive',
      'React uses Web Workers to render on a background thread',
      'Component trees are split into isolated rendering contexts',
      'State updates are rate-limited to 60 per second'
    ],
    answer: 'Rendering is split across multiple frames so the browser stays responsive',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Time slicing allows React to pause rendering work mid-tree, yield control to the browser for higher-priority work (like input), then resume. This keeps the UI responsive even during complex renders.',
    references: ['https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react']
  },

  // ── Advanced Hooks ────────────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'Advanced Hooks',
    subtopic: 'useImperativeHandle',
    type: 'mcq',
    prompt: 'What is `useImperativeHandle` used for?',
    options: [
      'Accessing parent component methods from a child',
      'Customizing the ref value a component exposes to its parent, limiting what the parent can do',
      'Creating imperative animations without state',
      'Bypassing React\'s rendering cycle for performance'
    ],
    answer: 'Customizing the ref value a component exposes to its parent, limiting what the parent can do',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'useImperativeHandle (used with forwardRef or React 19 ref prop) lets you control what methods/properties the parent can access via ref. Instead of exposing the raw DOM node, you expose a custom API: e.g., { focus, clear }.',
    references: ['https://react.dev/reference/react/useImperativeHandle']
  },
  {
    level: 'SENIOR',
    topic: 'Advanced Hooks',
    subtopic: 'useReducer',
    type: 'mcq',
    prompt: 'How does `useReducer` with Context replace a simple state management library?',
    options: [
      'It provides time-travel debugging out of the box',
      'The reducer handles complex state transitions; Context distributes state and dispatch to any descendant without prop drilling',
      'It automatically persists state to localStorage',
      'It provides built-in memoization for all selectors'
    ],
    answer: 'The reducer handles complex state transitions; Context distributes state and dispatch to any descendant without prop drilling',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Combining useReducer with two separate contexts (one for state, one for dispatch) is a scalable pattern. It avoids prop drilling, keeps mutation logic centralized in the reducer, and stable dispatch reference avoids consumer re-renders.',
    references: ['https://react.dev/learn/scaling-up-with-reducer-and-context']
  },
  {
    level: 'SENIOR',
    topic: 'Advanced Hooks',
    subtopic: 'Custom hooks',
    type: 'mcq',
    prompt: 'What is an important property of state/refs created inside a custom hook?',
    options: [
      'They are shared across all component instances that use the hook',
      'Each component instance that calls the hook gets its own isolated state',
      'They are stored in a global hook registry',
      'They persist until the page is refreshed'
    ],
    answer: 'Each component instance that calls the hook gets its own isolated state',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Custom hooks encapsulate logic but state and refs inside them are scoped to the calling component instance. Two components using the same hook do not share state — each gets their own copy.',
    references: ['https://react.dev/learn/reusing-logic-with-custom-hooks#custom-hooks-let-you-share-stateful-logic-not-state-itself']
  },
  {
    level: 'SENIOR',
    topic: 'Advanced Hooks',
    subtopic: 'useLayoutEffect',
    type: 'mcq',
    prompt: 'A tooltip component must position itself based on the trigger element\'s bounding rect. Which hook should you use to measure and position before paint?',
    options: [
      'useEffect — timing does not matter for positioning',
      'useLayoutEffect — it fires synchronously before the browser paints, preventing a visible flicker',
      'useMemo — the calculation should be memoized',
      'useRef — store the measurements in a ref'
    ],
    answer: 'useLayoutEffect — it fires synchronously before the browser paints, preventing a visible flicker',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Measuring DOM elements and then updating position in useEffect would cause a visible flicker (paint at wrong position then re-paint). useLayoutEffect fires before paint, so the position is correct on first render.',
    references: ['https://react.dev/reference/react/useLayoutEffect']
  },
  {
    level: 'SENIOR',
    topic: 'Advanced Hooks',
    subtopic: 'useDebugValue',
    type: 'mcq',
    prompt: 'What is `useDebugValue` used for?',
    options: [
      'Logging all state changes to the console',
      'Adding a label to a custom hook that appears in React DevTools',
      'Breaking into the debugger at a specific point in rendering',
      'Validating hook inputs at runtime'
    ],
    answer: 'Adding a label to a custom hook that appears in React DevTools',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'useDebugValue adds a display label to a custom hook when inspected in React DevTools. It accepts a second formatter argument for expensive formatting that only runs when DevTools is open.',
    references: ['https://react.dev/reference/react/useDebugValue']
  },

  // ── React 19 ──────────────────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'React 19',
    subtopic: 'Server Components',
    type: 'mcq',
    prompt: 'What is a key characteristic of React Server Components?',
    options: [
      'They run on both server and client',
      'They can use all React hooks including useState and useEffect',
      'They render on the server only — they have no access to browser APIs, state, or effects',
      'They require a separate bundler from client components'
    ],
    answer: 'They render on the server only — they have no access to browser APIs, state, or effects',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Server Components run exclusively on the server and cannot use useState, useEffect, or browser APIs. They can directly access server resources (DB, filesystem) and their output is streamed to the client as a React tree.',
    references: ['https://react.dev/reference/rsc/server-components']
  },
  {
    level: 'SENIOR',
    topic: 'React 19',
    subtopic: 'Server Actions',
    type: 'mcq',
    prompt: 'What is a React Server Action?',
    options: [
      'A Redux action processed on the server side',
      'An async function marked with "use server" that can be called from client components to run server-side logic',
      'A REST endpoint automatically generated from component props',
      'A WebSocket handler for real-time server-to-client communication'
    ],
    answer: 'An async function marked with "use server" that can be called from client components to run server-side logic',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Server Actions are async functions tagged with "use server". Client components can call them directly (they compile to RPC calls). They can mutate server state, access the DB, and revalidate caches.',
    references: ['https://react.dev/reference/rsc/server-actions']
  },
  {
    level: 'SENIOR',
    topic: 'React 19',
    subtopic: 'use hook with Context',
    type: 'mcq',
    prompt: 'How does `use(Context)` in React 19 differ from `useContext(Context)`?',
    options: [
      'use() is asynchronous; useContext is synchronous',
      'use() can be called conditionally and inside loops; useContext cannot',
      'use() is for Server Components; useContext is for Client Components',
      'They are identical — use() is just an alias for useContext'
    ],
    answer: 'use() can be called conditionally and inside loops; useContext cannot',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'use(Context) is not a traditional hook — it follows different rules. It can be called after early returns, inside if statements and loops. This makes it more flexible for conditional context reading.',
    references: ['https://react.dev/reference/react/use#reading-context-with-use']
  },
  {
    level: 'SENIOR',
    topic: 'React 19',
    subtopic: 'useFormStatus',
    type: 'mcq',
    prompt: 'What does `useFormStatus` provide?',
    options: [
      'Validation state for individual form fields',
      'The pending status of the parent form\'s submission action, accessible from child components',
      'The submission history of the form',
      'The current values of all form fields'
    ],
    answer: 'The pending status of the parent form\'s submission action, accessible from child components',
    difficulty: 'hard',
    estimatedTime: 60,
    explanation: 'useFormStatus must be called inside a component that is rendered inside a <form>. It returns { pending, data, method, action }, letting a submit button disable itself while the form action is in progress.',
    references: ['https://react.dev/reference/react-dom/hooks/useFormStatus']
  },

  // ── Performance Deep Dive ─────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'Performance',
    subtopic: 'Rendering optimization',
    type: 'mcq',
    prompt: 'A large list renders slowly because each item calls an expensive calculation. What is the optimal React solution?',
    options: [
      'Wrap the entire list in React.memo',
      'Use useMemo on each item\'s calculation, keyed to the item\'s data',
      'Virtualize the list (render only visible items) using a library like TanStack Virtual',
      'Move the list to a Server Component'
    ],
    answer: 'Virtualize the list (render only visible items) using a library like TanStack Virtual',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'For large lists, windowing/virtualization is the most impactful optimization — only rendering visible rows avoids rendering thousands of DOM nodes. useMemo per item still renders all items. Memo does not help if items are unique.',
    references: ['https://tanstack.com/virtual/latest']
  },
  {
    level: 'SENIOR',
    topic: 'Performance',
    subtopic: 'Profiling',
    type: 'mcq',
    prompt: 'In the React DevTools Profiler, what does a gray "did not render" entry mean?',
    options: [
      'The component threw an error and was caught by an Error Boundary',
      'The component was skipped (memoized) because its props did not change',
      'The component was lazily loaded and not yet in the bundle',
      'The component rendered but produced no DOM output'
    ],
    answer: 'The component was skipped (memoized) because its props did not change',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'In the Profiler flame graph, gray bars indicate components that were not re-rendered in that commit — either because they are memoized or because React skipped them. This is the desired result for optimized components.',
    references: ['https://react.dev/reference/react/Profiler']
  },
  {
    level: 'SENIOR',
    topic: 'Performance',
    subtopic: 'Bundle optimization',
    type: 'mcq',
    prompt: 'What is the purpose of `React.lazy()` with dynamic `import()`?',
    options: [
      'To cache component state between route changes',
      'To split the component into a separate chunk loaded on demand, reducing initial bundle size',
      'To render the component in a Web Worker',
      'To defer rendering until the browser is idle'
    ],
    answer: 'To split the component into a separate chunk loaded on demand, reducing initial bundle size',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'React.lazy() combined with dynamic import() enables code splitting at the component level. The bundler creates a separate chunk that is only downloaded when the component is first needed.',
    references: ['https://react.dev/reference/react/lazy']
  },
  {
    level: 'SENIOR',
    topic: 'Performance',
    subtopic: 'Memoization pitfalls',
    type: 'mcq',
    prompt: 'When does `React.memo` NOT prevent a re-render?',
    options: [
      'When the component uses useContext and the context value changes',
      'When the component\'s key changes',
      'When the parent passes a new function reference as a prop without useCallback',
      'All of the above'
    ],
    answer: 'All of the above',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'React.memo only skips renders when props are shallowly equal. Context changes, key changes, and new function references all bypass memo\'s optimization. Combine with useCallback/useMemo for stable references.',
    references: ['https://react.dev/reference/react/memo#my-component-rerenders-when-a-prop-is-an-object-or-array']
  },
  {
    level: 'SENIOR',
    topic: 'Performance',
    subtopic: 'React Compiler',
    type: 'mcq',
    prompt: 'What does the React Compiler (React Forget) do?',
    options: [
      'Compiles JSX to vanilla JavaScript without React runtime',
      'Automatically adds useMemo, useCallback, and React.memo where beneficial, eliminating manual memoization',
      'Compiles Server Components to Node.js modules',
      'Converts class components to function components'
    ],
    answer: 'Automatically adds useMemo, useCallback, and React.memo where beneficial, eliminating manual memoization',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'The React Compiler statically analyses component code and inserts memoization automatically where it determines it is safe and beneficial, removing the need for manual useMemo/useCallback in most cases.',
    references: ['https://react.dev/learn/react-compiler']
  },

  // ── Architecture Patterns ─────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'Architecture',
    subtopic: 'Compound Components',
    type: 'mcq',
    prompt: 'What is the Compound Components pattern?',
    options: [
      'A pattern where a parent component and several child components share implicit state via Context',
      'A pattern for combining multiple HOCs into one',
      'Rendering multiple independent components in a single route',
      'Using React.cloneElement to pass props to all children'
    ],
    answer: 'A pattern where a parent component and several child components share implicit state via Context',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Compound Components (e.g., <Select>, <Select.Option>) work together via shared Context. The parent manages state; child components consume it. This provides a flexible, declarative API without explicit prop passing.',
    references: ['https://kentcdodds.com/blog/compound-components-with-react-hooks']
  },
  {
    level: 'SENIOR',
    topic: 'Architecture',
    subtopic: 'State machine',
    type: 'mcq',
    prompt: 'When should you model UI state as a finite state machine (using XState or similar)?',
    options: [
      'Only for authentication flows',
      'When state has many interdependencies, invalid state combinations are possible, and explicit transitions prevent bugs',
      'When state is a simple boolean toggle',
      'When components need to share state without prop drilling'
    ],
    answer: 'When state has many interdependencies, invalid state combinations are possible, and explicit transitions prevent bugs',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'State machines excel at modeling complex state with explicit valid transitions, preventing impossible states (e.g., `isLoading=true` and `hasError=true` simultaneously). Great for multi-step forms, async flows, and animated transitions.',
    references: ['https://stately.ai/docs/xstate']
  },
  {
    level: 'SENIOR',
    topic: 'Architecture',
    subtopic: 'Feature slices',
    type: 'mcq',
    prompt: 'In a Feature Slice Design (FSD) architecture, what is the difference between the "entities" and "features" layers?',
    options: [
      'Entities are server-side models; features are client-side components',
      'Entities represent business domain models with their base UI; features are user-facing interactions composed from entities',
      'They are synonymous terms for the same concept',
      'Entities hold global state; features hold local component state'
    ],
    answer: 'Entities represent business domain models with their base UI; features are user-facing interactions composed from entities',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'In FSD: entities are the core business objects (User, Product) with base schemas and minimal UI. Features are specific user interactions (auth, search, cart) that compose entities. This separation prevents circular dependencies.',
    references: ['https://feature-sliced.design/docs/get-started/overview']
  },
  {
    level: 'SENIOR',
    topic: 'Architecture',
    subtopic: 'Micro-frontends',
    type: 'mcq',
    prompt: 'What is a potential downside of micro-frontend architecture with separate React apps?',
    options: [
      'Cannot share CSS between micro-frontends',
      'Multiple React instances on the page can cause duplicate bundles, inconsistent state, and version conflicts',
      'Micro-frontends cannot use hooks',
      'Event bubbling does not work across micro-frontend boundaries'
    ],
    answer: 'Multiple React instances on the page can cause duplicate bundles, inconsistent state, and version conflicts',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Running multiple React instances multiplies bundle size and breaks component sharing (Context does not cross React roots). Module Federation with shared packages mitigates this by sharing a single React instance.',
    references: ['https://module-federation.io/']
  },

  // ── Testing Advanced ──────────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'Testing',
    subtopic: 'Testing hooks',
    type: 'mcq',
    prompt: 'How do you test a custom hook in isolation without a wrapping component?',
    options: [
      'Render the hook inside a minimal class component',
      'Call the hook function directly in the test',
      'Use renderHook() from @testing-library/react',
      'Hooks cannot be tested in isolation'
    ],
    answer: 'Use renderHook() from @testing-library/react',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'renderHook() mounts a minimal test harness for the hook and returns { result, rerender, unmount }. result.current gives the hook\'s return value. Use act() for state updates.',
    references: ['https://testing-library.com/docs/react-testing-library/api/#renderhook']
  },
  {
    level: 'SENIOR',
    topic: 'Testing',
    subtopic: 'MSW',
    type: 'mcq',
    prompt: 'Why is Mock Service Worker (MSW) preferred over mocking `fetch` directly?',
    options: [
      'MSW is faster than fetch mocking',
      'MSW intercepts at the network level using a Service Worker, making tests realistic — the component code does not need to change between test and production',
      'MSW automatically generates test assertions',
      'Direct fetch mocking does not work with Vitest'
    ],
    answer: 'MSW intercepts at the network level using a Service Worker, making tests realistic — the component code does not need to change between test and production',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'MSW intercepts real network requests so your components use the exact same code paths in tests and production. Direct fetch mocking requires replacing the global fetch, which can leak between tests and misses intermediate layers.',
    references: ['https://mswjs.io/docs/philosophy']
  },
  {
    level: 'SENIOR',
    topic: 'Testing',
    subtopic: 'Contract testing',
    type: 'mcq',
    prompt: 'What does consumer-driven contract testing test?',
    options: [
      'That the UI matches the design specification',
      'That the API provider satisfies the specific expectations of each consumer without a full integration test environment',
      'That the component renders correctly in all browsers',
      'That database queries return correct results'
    ],
    answer: 'That the API provider satisfies the specific expectations of each consumer without a full integration test environment',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Contract tests (e.g., Pact) verify the interface between consumer and provider. The consumer defines expected interactions; the provider runs those expectations against its real implementation without needing the consumer running.',
    references: ['https://pact.io/']
  },
  {
    level: 'SENIOR',
    topic: 'Testing',
    subtopic: 'Accessibility testing',
    type: 'mcq',
    prompt: 'Which tool can run automated accessibility checks in Jest/Vitest tests?',
    options: [
      'Lighthouse',
      'jest-axe / vitest-axe — wraps the axe-core engine for unit/integration tests',
      'Storybook a11y addon',
      'ESLint jsx-a11y plugin'
    ],
    answer: 'jest-axe / vitest-axe — wraps the axe-core engine for unit/integration tests',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'jest-axe (or vitest-axe) runs axe-core accessibility checks against rendered components in tests. `expect(await axe(container)).toHaveNoViolations()` catches WCAG violations automatically.',
    references: ['https://github.com/nickcolley/jest-axe']
  },
  {
    level: 'SENIOR',
    topic: 'Testing',
    subtopic: 'Snapshot testing',
    type: 'mcq',
    prompt: 'What is a major downside of snapshot testing in React?',
    options: [
      'Snapshots are too slow to be practical',
      'Snapshots can break frequently on unrelated changes, become stale, and developers often blindly update them without reviewing',
      'Snapshot tests do not work with functional components',
      'Snapshots cannot be committed to version control'
    ],
    answer: 'Snapshots can break frequently on unrelated changes, become stale, and developers often blindly update them without reviewing',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Snapshots are brittle. Any markup change breaks all snapshots. Teams often run --updateSnapshot without reviewing, making snapshots useless as regressions detectors. Prefer explicit behavior assertions over snapshots.',
    references: ['https://jestjs.io/docs/snapshot-testing#are-snapshots-written-automatically-on-the-first-run']
  },
  {
    level: 'SENIOR',
    topic: 'Testing',
    subtopic: 'Test isolation',
    type: 'mcq',
    prompt: 'What is the purpose of `beforeEach(() => cleanup())` in RTL tests, and is it needed in modern setups?',
    options: [
      'It resets all mocked functions; it is always needed',
      'It removes rendered components from the DOM between tests; not needed in modern setups as RTL auto-cleans after each test',
      'It clears localStorage; needed when testing auth flows',
      'It resets the Redux store; needed when sharing store between tests'
    ],
    answer: 'It removes rendered components from the DOM between tests; not needed in modern setups as RTL auto-cleans after each test',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'RTL automatically calls cleanup() after each test when using jest, vitest, or @testing-library/jest-dom. Manually calling it in beforeEach is redundant unless using a framework that doesn\'t auto-clean.',
    references: ['https://testing-library.com/docs/react-testing-library/api#cleanup']
  },

  // ── State Management Advanced ─────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'State Management',
    subtopic: 'Redux Toolkit',
    type: 'mcq',
    prompt: 'What does `createSlice` in Redux Toolkit provide?',
    options: [
      'A code-split bundle for Redux state',
      'Auto-generated action creators, action types, and reducer from a single configuration object',
      'A middleware for handling async thunks',
      'A selector factory for memoized state derivation'
    ],
    answer: 'Auto-generated action creators, action types, and reducer from a single configuration object',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'createSlice automatically generates: typed action creators, action type strings, and a reducer. Under the hood, it uses Immer for immutable updates written as mutations.',
    references: ['https://redux-toolkit.js.org/api/createSlice']
  },
  {
    level: 'SENIOR',
    topic: 'State Management',
    subtopic: 'Zustand',
    type: 'mcq',
    prompt: 'What is the key difference between Zustand and Redux for state management in React?',
    options: [
      'Zustand cannot persist state; Redux can',
      'Zustand uses a simple store outside the React tree with minimal boilerplate; Redux requires actions, reducers, and often middleware',
      'Zustand is synchronous; Redux supports async updates',
      'Zustand uses proxies for reactivity; Redux uses observables'
    ],
    answer: 'Zustand uses a simple store outside the React tree with minimal boilerplate; Redux requires actions, reducers, and often middleware',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Zustand provides a minimal API (create, get, set, subscribe) with no Provider needed. Redux Toolkit reduces Redux boilerplate but still requires more structure. Zustand is better for simple-medium complexity; Redux scales better for large teams.',
    references: ['https://zustand-demo.pmnd.rs/']
  },
  {
    level: 'SENIOR',
    topic: 'State Management',
    subtopic: 'React Query',
    type: 'mcq',
    prompt: 'What problem does TanStack Query (React Query) primarily solve?',
    options: [
      'Client-side state management for UI state (modals, forms)',
      'Server state management — caching, refetching, synchronization, and stale-while-revalidate for async data',
      'Replacing Redux for all state management needs',
      'Real-time WebSocket state synchronization'
    ],
    answer: 'Server state management — caching, refetching, synchronization, and stale-while-revalidate for async data',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'React Query manages the async data lifecycle (loading, error, success, refetch, cache invalidation). It treats server data separately from client UI state, which is a fundamentally different and often better model than putting everything in Redux.',
    references: ['https://tanstack.com/query/latest/docs/framework/react/overview']
  },
  {
    level: 'SENIOR',
    topic: 'State Management',
    subtopic: 'Jotai/Recoil',
    type: 'mcq',
    prompt: 'What is the "atomic" state management model (Jotai/Recoil)?',
    options: [
      'State is stored in an atomic data structure that is thread-safe',
      'State is split into small independent atoms; components subscribe to exactly the atoms they need, minimizing re-renders',
      'Each component has its own isolated atomic store',
      'State updates are atomic database transactions'
    ],
    answer: 'State is split into small independent atoms; components subscribe to exactly the atoms they need, minimizing re-renders',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Atomic state (Jotai) stores state as fine-grained atoms. Components subscribe only to the atoms they use. If atom A changes, only components using A re-render — not all components as with a large Context value.',
    references: ['https://jotai.org/docs/introduction']
  },

  // ── Error Handling Advanced ───────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'Error Handling',
    subtopic: 'Error Boundaries advanced',
    type: 'mcq',
    prompt: 'Which lifecycle method should you implement in an Error Boundary to log errors to an error reporting service?',
    options: [
      'getDerivedStateFromError — it has access to the error and component stack',
      'componentDidCatch — it receives the error and the info object with componentStack',
      'render — log the error before returning the fallback UI',
      'componentDidUpdate — check if state.hasError changed'
    ],
    answer: 'componentDidCatch — it receives the error and the info object with componentStack',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'getDerivedStateFromError updates state to show fallback UI (it must be pure). componentDidCatch is the right place for side effects like logging to Sentry, since it runs after the error boundary has rendered.',
    references: ['https://react.dev/reference/react/Component#componentdidcatch']
  },
  {
    level: 'SENIOR',
    topic: 'Error Handling',
    subtopic: 'Boundaries with reset',
    type: 'mcq',
    prompt: 'How can you allow a user to retry after an Error Boundary catches an error?',
    options: [
      'Error Boundaries cannot be reset — the page must reload',
      'Call this.setState({ hasError: false }) via a prop callback or event from the fallback UI',
      'Remove the Error Boundary temporarily from the tree',
      'Use window.location.reload() inside the fallback UI'
    ],
    answer: 'Call this.setState({ hasError: false }) via a prop callback or event from the fallback UI',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'The Error Boundary can expose a reset method or accept an onReset prop. Calling setState({ hasError: false }) clears the error state and re-renders the children. react-error-boundary makes this easier with its resetErrorBoundary prop.',
    references: ['https://github.com/bvaughn/react-error-boundary#readme']
  },

  // ── Server Components in depth ────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'React 19',
    subtopic: 'Client vs Server Components',
    type: 'mcq',
    prompt: 'You have a component that needs `useState`. Where must it run?',
    options: [
      'Server Component — state is managed on the server',
      'Client Component — marked with "use client"; useState can only run on the client',
      'Either — React detects hooks automatically and routes to the right environment',
      'Server Component with server-side state'
    ],
    answer: 'Client Component — marked with "use client"; useState can only run on the client',
    difficulty: 'hard',
    estimatedTime: 60,
    explanation: 'Any component using hooks (useState, useEffect, useContext, etc.) or browser APIs must be a Client Component ("use client"). Server Components are stateless by definition.',
    references: ['https://react.dev/reference/rsc/server-components#server-components-without-a-server']
  },
  {
    level: 'SENIOR',
    topic: 'React 19',
    subtopic: 'Streaming SSR',
    type: 'mcq',
    prompt: 'What does `renderToPipeableStream` enable in React 19 SSR?',
    options: [
      'Rendering components as static HTML strings synchronously',
      'Streaming HTML to the client progressively — critical content arrives first while slower data loads in Suspense boundaries',
      'Rendering components in parallel across multiple CPU threads',
      'Sending real-time updates via Server-Sent Events'
    ],
    answer: 'Streaming HTML to the client progressively — critical content arrives first while slower data loads in Suspense boundaries',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'renderToPipeableStream streams the HTML shell immediately, then streams in Suspense boundary content as their data resolves. The browser can start parsing and hydrating early content while the rest loads.',
    references: ['https://react.dev/reference/react-dom/server/renderToPipeableStream']
  },

  // ── Advanced Patterns ─────────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'Patterns',
    subtopic: 'Headless UI',
    type: 'mcq',
    prompt: 'What is the "Headless UI" pattern?',
    options: [
      'Components that render without any visual output (null)',
      'Components or hooks that provide behavior and accessibility without any visual styling, letting consumers supply their own UI',
      'Server Components that run without a browser environment',
      'Components tested in a Node.js environment without a DOM'
    ],
    answer: 'Components or hooks that provide behavior and accessibility without any visual styling, letting consumers supply their own UI',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Headless UI decouples logic/accessibility from presentation. Libraries like Radix UI and Headless UI provide fully accessible, unstyled components. You compose their hooks/components with your own CSS.',
    references: ['https://www.radix-ui.com/primitives/docs/overview/introduction']
  },
  {
    level: 'SENIOR',
    topic: 'Patterns',
    subtopic: 'Container/Presenter',
    type: 'mcq',
    prompt: 'In modern React, the Container/Presenter (Smart/Dumb) pattern has been largely replaced by:',
    options: [
      'Class components with HOCs',
      'Custom hooks that separate data-fetching logic from presentation components',
      'Redux selectors that compute view data',
      'Server Components that pre-compute all data'
    ],
    answer: 'Custom hooks that separate data-fetching logic from presentation components',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Custom hooks replace the container component role — they encapsulate data fetching, derived state, and callbacks. The presentation component remains pure, accepting the hook\'s return value as props or using the hook directly.',
    references: ['https://react.dev/learn/reusing-logic-with-custom-hooks']
  },
  {
    level: 'SENIOR',
    topic: 'Patterns',
    subtopic: 'Observer pattern',
    type: 'mcq',
    prompt: 'How would you implement an event bus pattern in React for cross-component communication?',
    options: [
      'Use window.dispatchEvent and window.addEventListener',
      'Use a shared external store (Zustand/Redux) or the EventEmitter pattern via a singleton, with subscription in useEffect',
      'Use React.cloneElement to pass event handlers down the tree',
      'React Context is the only valid cross-component communication mechanism'
    ],
    answer: 'Use a shared external store (Zustand/Redux) or the EventEmitter pattern via a singleton, with subscription in useEffect',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'For cross-component communication without direct relationships, a shared store is cleanest. An EventEmitter singleton works but requires careful cleanup in useEffect returns. Context is fine for parent→child but not for sibling communication.',
    references: ['https://zustand-demo.pmnd.rs/']
  },

  // ── TypeScript Advanced ───────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'TypeScript',
    subtopic: 'Generic components',
    type: 'mcq',
    prompt: 'How do you create a generic React component in TypeScript?',
    options: [
      'function List(props: GenericProps): JSX.Element',
      'function List<T>(props: { items: T[]; renderItem: (item: T) => React.ReactNode }): JSX.Element',
      'const List: React.Generic<T> = (props) => ...',
      'Generic components are not supported in React TypeScript'
    ],
    answer: 'function List<T>(props: { items: T[]; renderItem: (item: T) => React.ReactNode }): JSX.Element',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Generic components use a type parameter to infer the item type from props. TypeScript infers T from the items array, providing full type safety in the renderItem callback.',
    references: ['https://react.dev/learn/typescript#typing-component-props']
  },
  {
    level: 'SENIOR',
    topic: 'TypeScript',
    subtopic: 'Discriminated unions for state',
    type: 'mcq',
    prompt: 'What is the advantage of using discriminated union types for async state?',
    options: [
      'They are faster to type than interface merging',
      'TypeScript can narrow the type in each branch, making invalid state combinations impossible',
      'They reduce bundle size by eliminating runtime type checks',
      'They work better with React.memo comparisons'
    ],
    answer: 'TypeScript can narrow the type in each branch, making invalid state combinations impossible',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'type State = { status: "idle" } | { status: "loading" } | { status: "success"; data: User } | { status: "error"; error: string } — TypeScript narrows the type in each if/switch branch, preventing accessing data when status is "loading".',
    references: ['https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions']
  },
  {
    level: 'SENIOR',
    topic: 'TypeScript',
    subtopic: 'ComponentProps utility',
    type: 'mcq',
    prompt: 'How do you extend a native HTML element\'s props in a custom component?',
    options: [
      'interface ButtonProps extends EventHandler { label: string }',
      'interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> { variant?: "primary" | "danger" }',
      'type ButtonProps = HTMLButtonElement & { variant: string }',
      'You cannot extend native HTML props in TypeScript'
    ],
    answer: 'interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> { variant?: "primary" | "danger" }',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'React.ComponentPropsWithoutRef<"button"> provides all native button attributes. Your component can spread them onto the DOM element while adding custom props. Use WithRef variant when forwarding refs.',
    references: ['https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/#wrappingmirroring-a-html-element']
  },

  // ── SSR / Hydration ───────────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'SSR',
    subtopic: 'Hydration mismatch',
    type: 'mcq',
    prompt: 'A hydration mismatch error means:',
    options: [
      'The server and client rendered different HTML — React cannot reconcile them and falls back to client-side rendering',
      'The server component was not found in the client bundle',
      'The component\'s state was lost during hydration',
      'React failed to attach event listeners to the server HTML'
    ],
    answer: 'The server and client rendered different HTML — React cannot reconcile them and falls back to client-side rendering',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Hydration mismatches occur when server-rendered HTML differs from what React generates on the client (e.g., using Date.now(), window, random values in render). React 18 recovers gracefully but shows a warning and re-renders the mismatched subtree.',
    references: ['https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors']
  },
  {
    level: 'SENIOR',
    topic: 'SSR',
    subtopic: 'suppressHydrationWarning',
    type: 'mcq',
    prompt: 'When is `suppressHydrationWarning` appropriate to use?',
    options: [
      'On all elements to prevent performance-harming hydration checks',
      'On elements whose content legitimately differs between server and client (e.g., timestamps, browser-only data)',
      'As a fix for hydration bugs caused by conditional rendering',
      'On Server Components that use browser APIs'
    ],
    answer: 'On elements whose content legitimately differs between server and client (e.g., timestamps, browser-only data)',
    difficulty: 'hard',
    estimatedTime: 60,
    explanation: 'suppressHydrationWarning tells React to not warn about mismatches in that element\'s attributes/content. Use it only when the mismatch is intentional (e.g., a clock showing current time). Overuse hides real bugs.',
    references: ['https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors']
  },

  // ── Security ──────────────────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'Security',
    subtopic: 'XSS',
    type: 'mcq',
    prompt: 'How does React protect against XSS (Cross-Site Scripting) by default?',
    options: [
      'React uses a Content Security Policy header automatically',
      'React escapes all values embedded in JSX before inserting them into the DOM',
      'React sanitizes all user input with a built-in DOMPurify equivalent',
      'React blocks inline script tags in JSX'
    ],
    answer: 'React escapes all values embedded in JSX before inserting them into the DOM',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'React automatically escapes strings rendered in JSX, converting < to &lt;, > to &gt;, etc. This prevents injected HTML from executing as script. The only exception is dangerouslySetInnerHTML, which bypasses this protection.',
    references: ['https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html']
  },
  {
    level: 'SENIOR',
    topic: 'Security',
    subtopic: 'dangerouslySetInnerHTML',
    type: 'mcq',
    prompt: 'When using `dangerouslySetInnerHTML`, what must you do to prevent XSS?',
    options: [
      'Nothing — React sanitizes the HTML automatically when using this prop',
      'Sanitize the HTML with a library like DOMPurify before passing it to the prop',
      'Escape the HTML string with encodeURIComponent',
      'Only use it in Server Components'
    ],
    answer: 'Sanitize the HTML with a library like DOMPurify before passing it to the prop',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'dangerouslySetInnerHTML bypasses React\'s XSS protection and inserts HTML as-is. Always sanitize untrusted HTML with DOMPurify or similar before using it, or avoid it entirely.',
    references: ['https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html']
  },

  // ── Accessibility ─────────────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'Accessibility',
    subtopic: 'Focus management',
    type: 'mcq',
    prompt: 'In a modal dialog, what focus management is required for accessibility?',
    options: [
      'No focus management needed — users will find the modal',
      'Focus should be moved to the modal on open, trapped inside it while open, and returned to the trigger element on close',
      'Focus should be moved to the first focusable element on the page',
      'Modals should use tabIndex="-1" to remove them from tab order'
    ],
    answer: 'Focus should be moved to the modal on open, trapped inside it while open, and returned to the trigger element on close',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'WCAG requires modal dialogs to: receive focus on open (ideally the first focusable element or the dialog itself), trap focus within the modal (Tab/Shift+Tab cycle inside), and return focus to the trigger on close.',
    references: ['https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/']
  },
  {
    level: 'SENIOR',
    topic: 'Accessibility',
    subtopic: 'ARIA live regions',
    type: 'mcq',
    prompt: 'What is `aria-live="assertive"` used for?',
    options: [
      'Making an element\'s content read immediately, interrupting the current screen reader output',
      'Making a region interactive for keyboard users',
      'Preventing screen readers from announcing updates',
      'Marking content as important for search engine indexing'
    ],
    answer: 'Making an element\'s content read immediately, interrupting the current screen reader output',
    difficulty: 'hard',
    estimatedTime: 60,
    explanation: 'aria-live="assertive" causes screen readers to immediately announce updates, interrupting whatever they were reading. Use only for urgent messages (errors, critical alerts). Use "polite" for non-urgent updates (status messages).',
    references: ['https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions']
  },

  // ── Internationalization ──────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'i18n',
    subtopic: 'React i18next',
    type: 'mcq',
    prompt: 'What is the "i18n key" approach in react-i18next and what is its main benefit?',
    options: [
      'Each string is identified by a UUID key for uniqueness',
      'Strings are referenced by semantic keys (e.g., "auth.login.submit") stored in translation files per locale, enabling easy language switching without code changes',
      'Keys are hashed versions of the English text to detect stale translations',
      'Keys are URL-encoded strings for safe HTTP transport'
    ],
    answer: 'Strings are referenced by semantic keys (e.g., "auth.login.submit") stored in translation files per locale, enabling easy language switching without code changes',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'The key-based approach decouples UI text from code. Translation files (JSON per locale) map keys to translations. Adding a new language only requires a new translation file, not code changes.',
    references: ['https://react.i18next.com/guides/quick-start']
  },

  // ── GraphQL ───────────────────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'Data Fetching',
    subtopic: 'Apollo Client',
    type: 'mcq',
    prompt: 'What is the key advantage of GraphQL over REST for a React client?',
    options: [
      'GraphQL is always faster than REST',
      'The client specifies exactly what data it needs — no over-fetching (too many fields) or under-fetching (too few, requiring extra requests)',
      'GraphQL automatically handles authentication',
      'GraphQL responses are cached by the browser automatically'
    ],
    answer: 'The client specifies exactly what data it needs — no over-fetching (too many fields) or under-fetching (too few, requiring extra requests)',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'GraphQL queries let clients request precisely the fields they need. This solves REST\'s over-fetching (getting unused fields) and under-fetching (needing multiple round-trips to assemble data for a view).',
    references: ['https://graphql.org/learn/']
  },

  // ── CI/CD and deployment ──────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'DevOps',
    subtopic: 'Performance budgets',
    type: 'mcq',
    prompt: 'What is a "performance budget" in the context of frontend CI/CD?',
    options: [
      'The monthly cloud infrastructure cost limit',
      'Defined limits on metrics (bundle size, Lighthouse scores, LCP) that fail the CI build if exceeded',
      'The time limit for a CI pipeline to complete',
      'A financial budget for performance testing tools'
    ],
    answer: 'Defined limits on metrics (bundle size, Lighthouse scores, LCP) that fail the CI build if exceeded',
    difficulty: 'hard',
    estimatedTime: 60,
    explanation: 'Performance budgets set measurable limits. CI tools (Lighthouse CI, bundlesize, size-limit) check metrics on every PR and fail if budgets are exceeded, preventing performance regressions from shipping.',
    references: ['https://web.dev/articles/performance-budgets-101']
  },

  // ── Module Federation ─────────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'Architecture',
    subtopic: 'Module Federation',
    type: 'mcq',
    prompt: 'In Webpack Module Federation, what is a "remote" and what is a "host"?',
    options: [
      'Remote is the production server; host is the development server',
      'Remote is an application that exposes modules; host is an application that consumes those remote modules at runtime',
      'Remote is a CDN URL; host is the local application',
      'They are synonymous terms for federated modules'
    ],
    answer: 'Remote is an application that exposes modules; host is an application that consumes those remote modules at runtime',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Module Federation enables micro-frontends. Remote applications expose components/modules. Host applications dynamically import from remotes at runtime without bundling them — they are loaded from the remote\'s server.',
    references: ['https://module-federation.io/guide/start/index.html']
  },

  // ── Web APIs ──────────────────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'Web APIs',
    subtopic: 'Intersection Observer',
    type: 'mcq',
    prompt: 'How do you implement infinite scroll efficiently in React?',
    options: [
      'Listen to the window scroll event and check scrollTop + clientHeight >= scrollHeight',
      'Use the Intersection Observer API via a custom hook — observe a sentinel element at the bottom of the list',
      'Use requestAnimationFrame to poll scroll position',
      'Wrap the list in a scroll event handler with a debounce'
    ],
    answer: 'Use the Intersection Observer API via a custom hook — observe a sentinel element at the bottom of the list',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Intersection Observer fires a callback when a target element enters/exits the viewport. Placing a sentinel div at the list\'s bottom and observing it avoids scroll event polling, which is expensive and not GPU-accelerated.',
    references: ['https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API']
  },
  {
    level: 'SENIOR',
    topic: 'Web APIs',
    subtopic: 'ResizeObserver',
    type: 'mcq',
    prompt: 'Why should you use `ResizeObserver` instead of `window.resize` to track element size?',
    options: [
      'window.resize has been deprecated',
      'ResizeObserver observes individual element dimensions and fires only when those elements change, avoiding global event overhead',
      'ResizeObserver is throttled by the browser for performance',
      'window.resize only fires for window resize, not when CSS changes element dimensions'
    ],
    answer: 'ResizeObserver observes individual element dimensions and fires only when those elements change, avoiding global event overhead',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'window.resize fires for any viewport change. ResizeObserver observes specific elements — it fires when an element\'s content box changes due to any reason (viewport, CSS, DOM changes). More accurate and efficient for element-specific measurements.',
    references: ['https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver']
  },

  // ── Code Quality ──────────────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'Code Quality',
    subtopic: 'Component design',
    type: 'mcq',
    prompt: 'What is the Single Responsibility Principle applied to React components?',
    options: [
      'Each component should render exactly one DOM element',
      'Each component should have one reason to change — one clear purpose or concern',
      'Each component should be defined in its own file',
      'Each component should have at most one prop'
    ],
    answer: 'Each component should have one reason to change — one clear purpose or concern',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'SRP in React means components should not mix concerns: a data-fetching component should not also format data and manage animations. Extract each concern into focused components or custom hooks.',
    references: ['https://react.dev/learn/thinking-in-react']
  },
  {
    level: 'SENIOR',
    topic: 'Code Quality',
    subtopic: 'Dependency array correctness',
    type: 'mcq',
    prompt: 'ESLint\'s `exhaustive-deps` rule warns when useEffect/useMemo/useCallback dependencies are incomplete. Why is this important?',
    options: [
      'Missing deps cause the hook to never re-run even when values change, creating stale closure bugs',
      'Missing deps cause excessive re-runs, hurting performance',
      'Missing deps are a TypeScript type error',
      'React throws at runtime if dependencies are incomplete'
    ],
    answer: 'Missing deps cause the hook to never re-run even when values change, creating stale closure bugs',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'If a value used inside useEffect is not in the dependency array, the effect sees a stale (outdated) value. The eslint-plugin-react-hooks rule enforces completeness to prevent subtle bugs where effects use old state/prop values.',
    references: ['https://react.dev/learn/removing-effect-dependencies']
  },

  // ── Rendering internals ───────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'Internals',
    subtopic: 'Fiber architecture',
    type: 'mcq',
    prompt: 'What is the React Fiber architecture?',
    options: [
      'A WebAssembly-based rendering engine for React',
      'React\'s reimplementation of the reconciliation algorithm as a linked list of "fibers" enabling incremental, interruptible rendering',
      'A CSS-in-JS runtime engine for React styled-components',
      'A module bundler optimized for React applications'
    ],
    answer: 'React\'s reimplementation of the reconciliation algorithm as a linked list of "fibers" enabling incremental, interruptible rendering',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Fiber (React 16+) represents each component as a fiber node in a linked list. Unlike the old stack reconciler, Fiber can pause work, assign priorities, and resume — enabling concurrent features, Suspense, and time slicing.',
    references: ['https://github.com/acdlite/react-fiber-architecture']
  },
  {
    level: 'SENIOR',
    topic: 'Internals',
    subtopic: 'Commit phase',
    type: 'mcq',
    prompt: 'In React\'s two-phase rendering, what happens in the "commit" phase?',
    options: [
      'React computes what changes are needed by comparing virtual DOM trees',
      'React applies the computed changes to the real DOM and runs effects',
      'React prioritizes and schedules pending state updates',
      'React serializes the component tree to JSON for SSR'
    ],
    answer: 'React applies the computed changes to the real DOM and runs effects',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'The render phase (pure, can be interrupted) computes what changed. The commit phase (synchronous, cannot interrupt) applies DOM mutations, runs useLayoutEffect, then runs useEffect asynchronously after paint.',
    references: ['https://react.dev/learn/render-and-commit']
  },

  // ── Design System ─────────────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'Design Systems',
    subtopic: 'Component API design',
    type: 'mcq',
    prompt: 'When designing a reusable Button component, which prop design is most flexible?',
    options: [
      'Accepting a `style` prop with a predefined enum of styles',
      'Accepting all native button attributes via spread + an `asChild` prop to render as any element',
      'Hard-coding a fixed set of variants as separate components (PrimaryButton, SecondaryButton)',
      'Accepting children only — styling is handled externally by className'
    ],
    answer: 'Accepting all native button attributes via spread + an `asChild` prop to render as any element',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'The `asChild` pattern (from Radix UI) allows the component to render as any element (e.g., <a> for links) while maintaining all its styles and behavior. Combined with prop spreading, it provides maximum flexibility.',
    references: ['https://www.radix-ui.com/primitives/docs/utilities/slot']
  },

  // ── Real-world patterns ───────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'Real World',
    subtopic: 'Optimistic updates',
    type: 'mcq',
    prompt: 'What is the "optimistic update" pattern and what must you handle?',
    options: [
      'Rendering an optimistic placeholder before data is available — no rollback needed',
      'Immediately updating the UI assuming the operation succeeds, then rolling back if the server returns an error',
      'Preloading the next page of data before the user navigates to it',
      'Caching server responses to serve stale data optimistically'
    ],
    answer: 'Immediately updating the UI assuming the operation succeeds, then rolling back if the server returns an error',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Optimistic updates (e.g., immediately marking a todo as done before server confirms) improve perceived performance. You must handle rollback: if the server fails, revert state to the pre-update value and typically show an error.',
    references: ['https://react.dev/reference/react/useOptimistic']
  },
  {
    level: 'SENIOR',
    topic: 'Real World',
    subtopic: 'Prefetching',
    type: 'mcq',
    prompt: 'A dashboard has a "Reports" tab that loads a large dataset. Users always navigate to it after viewing the main tab. What is the best optimization?',
    options: [
      'Server-side render the Reports data and include it in the initial HTML',
      'Prefetch the Reports data during idle time when the main tab is active so the tab appears instant when clicked',
      'Lazy load the Reports component to reduce initial bundle',
      'Debounce the data fetch to avoid loading when users quickly switch tabs'
    ],
    answer: 'Prefetch the Reports data during idle time when the main tab is active so the tab appears instant when clicked',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Prefetching during idle time (requestIdleCallback or when hovering over the Reports tab link) pre-warms the cache. When the user navigates, data is already available, making the transition feel instant.',
    references: ['https://tanstack.com/query/latest/docs/framework/react/guides/prefetching']
  },

  // ── Monitoring ────────────────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'Observability',
    subtopic: 'Core Web Vitals',
    type: 'mcq',
    prompt: 'Which Core Web Vital measures the time from a user\'s interaction to the next paint?',
    options: [
      'LCP (Largest Contentful Paint)',
      'CLS (Cumulative Layout Shift)',
      'INP (Interaction to Next Paint)',
      'FID (First Input Delay)'
    ],
    answer: 'INP (Interaction to Next Paint)',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'INP replaced FID as the interactivity Core Web Vital in 2024. It measures the latency of all user interactions (click, keypress, tap) throughout the page lifetime, taking the worst-case interaction as the score.',
    references: ['https://web.dev/articles/inp']
  },
  {
    level: 'SENIOR',
    topic: 'Observability',
    subtopic: 'Real User Monitoring',
    type: 'mcq',
    prompt: 'What is the difference between synthetic monitoring and Real User Monitoring (RUM)?',
    options: [
      'Synthetic is server-side; RUM is client-side',
      'Synthetic runs scripted tests in controlled environments; RUM captures actual user experience in production across real devices and networks',
      'Synthetic measures Core Web Vitals; RUM measures server response times',
      'They are synonymous terms'
    ],
    answer: 'Synthetic runs scripted tests in controlled environments; RUM captures actual user experience in production across real devices and networks',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Synthetic monitoring (Lighthouse CI, WebPageTest) gives consistent, reproducible results in controlled conditions. RUM (Sentry Performance, Datadog) shows real performance experienced by actual users across all their devices, locations, and network conditions.',
    references: ['https://web.dev/articles/vitals-field-measurement-best-practices']
  },

  // ── Design patterns ───────────────────────────────────────────────────────
  {
    level: 'SENIOR',
    topic: 'Patterns',
    subtopic: 'Factory pattern',
    type: 'mcq',
    prompt: 'You have a form with many different field types (text, select, date, checkbox). What pattern best handles rendering the right field component per type?',
    options: [
      'A large switch/if-else chain in the parent component',
      'A field component factory — a map of fieldType → component that renders the right component given a config object',
      'Separate form components for each combination of field types',
      'Always render all field types and show/hide with CSS'
    ],
    answer: 'A field component factory — a map of fieldType → component that renders the right component given a config object',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'The factory pattern maps type keys to components: const FIELDS = { text: TextField, select: SelectField }. const Field = FIELDS[config.type]. This is extensible (adding new types just adds to the map) and avoids sprawling conditionals.',
    references: ['https://react.dev/learn/thinking-in-react']
  },
  {
    level: 'SENIOR',
    topic: 'Patterns',
    subtopic: 'Provider pattern',
    type: 'mcq',
    prompt: 'What is the "Provider composition" pattern and why is it useful?',
    options: [
      'Nesting multiple Providers inside each other in App.tsx — a known anti-pattern',
      'Composing multiple Providers into a single component to reduce nesting and make their relationship explicit',
      'Using a single global Provider for all application state',
      'A Redux middleware pattern for dispatching to multiple stores'
    ],
    answer: 'Composing multiple Providers into a single component to reduce nesting and make their relationship explicit',
    difficulty: 'hard',
    estimatedTime: 60,
    explanation: 'Instead of deeply nesting Providers in App.tsx, create an AppProviders component that wraps them all. This reduces visual nesting, makes dependencies explicit, and is easy to reuse in tests.',
    references: ['https://react.dev/learn/passing-data-deeply-with-context#using-and-providing-context-from-the-same-component']
  }
]
