import type { QuestionInput } from '../../domain/question/question.schema.js'

type Difficulty = 'easy' | 'medium' | 'hard'
type QuestionSeed = Omit<QuestionInput, 'technologyId' | 'difficulty'> & { difficulty: Difficulty }

export const reactMidQuestions: QuestionSeed[] = [
  // ── useState ──────────────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Hooks',
    subtopic: 'useState',
    type: 'mcq',
    prompt: 'What does `useState` return?',
    options: [
      'A single state value',
      'A tuple of [currentState, updaterFunction]',
      'A Promise that resolves to the state value',
      'An object with get and set properties'
    ],
    answer: 'A tuple of [currentState, updaterFunction]',
    difficulty: 'easy',
    estimatedTime: 45,
    explanation: 'useState returns a tuple: the current state value and a setter function to update it.',
    references: ['https://react.dev/reference/react/useState']
  },
  {
    level: 'MID',
    topic: 'Hooks',
    subtopic: 'useState',
    type: 'mcq',
    prompt: 'Given `const [count, setCount] = useState(0)`, what happens when you call `setCount(count + 1)` inside an event handler that fires twice rapidly?',
    options: [
      'count increments by 2',
      'count increments by 1 because state batching uses stale closure values',
      'count increments by 1 because React deduplicates updates',
      'A re-render error is thrown'
    ],
    answer: 'count increments by 1 because state batching uses stale closure values',
    difficulty: 'medium',
    estimatedTime: 90,
    explanation: 'setCount(count + 1) uses the closed-over `count` value. Both calls see the same stale value. Use the functional form setCount(c => c + 1) to avoid this.',
    references: ['https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state']
  },
  {
    level: 'MID',
    topic: 'Hooks',
    subtopic: 'useState',
    type: 'mcq',
    prompt: 'Which of the following correctly initializes state lazily in React?',
    options: [
      'useState(expensiveComputation())',
      'useState(() => expensiveComputation())',
      'useLazyState(expensiveComputation)',
      'useState(null); useEffect(() => setState(expensiveComputation()), [])'
    ],
    answer: 'useState(() => expensiveComputation())',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Passing an initializer function to useState ensures the expensive computation only runs once on mount, not on every render.',
    references: ['https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state']
  },
  {
    level: 'MID',
    topic: 'Hooks',
    subtopic: 'useState',
    type: 'mcq',
    prompt: 'Which statement about `setState` in a functional component is TRUE?',
    options: [
      'Calling setState always causes an immediate synchronous re-render',
      'Setting state to the same value as current state always causes a re-render',
      'React may batch multiple setState calls into a single re-render',
      'setState replaces the entire component state tree'
    ],
    answer: 'React may batch multiple setState calls into a single re-render',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'React batches state updates (in React 18+ even outside event handlers) to optimize performance. Setting state to the same value bails out of re-rendering after comparing with Object.is.',
    references: ['https://react.dev/learn/queueing-a-series-of-state-updates']
  },

  // ── useEffect ─────────────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Hooks',
    subtopic: 'useEffect',
    type: 'mcq',
    prompt: 'What is the purpose of the cleanup function returned by `useEffect`?',
    options: [
      'To reset state to its initial value',
      'To cancel or undo side effects before the next effect runs or the component unmounts',
      'To prevent the effect from running on the first render',
      'To run the effect synchronously after painting'
    ],
    answer: 'To cancel or undo side effects before the next effect runs or the component unmounts',
    difficulty: 'easy',
    estimatedTime: 45,
    explanation: 'The cleanup function returned from useEffect runs before the component unmounts and before the effect re-runs due to dependency changes. Use it to clear timers, cancel subscriptions, etc.',
    references: ['https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development']
  },
  {
    level: 'MID',
    topic: 'Hooks',
    subtopic: 'useEffect',
    type: 'mcq',
    prompt: 'A `useEffect` with an empty dependency array `[]` runs:',
    options: [
      'On every render',
      'Only on mount and unmount',
      'Only when the component re-renders due to parent changes',
      'Never'
    ],
    answer: 'Only on mount and unmount',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'An empty dependency array tells React the effect has no dependencies, so it runs only once after the initial render (mount) and the cleanup runs on unmount.',
    references: ['https://react.dev/reference/react/useEffect#parameters']
  },
  {
    level: 'MID',
    topic: 'Hooks',
    subtopic: 'useEffect',
    type: 'mcq',
    prompt: 'In React Strict Mode (development), why does useEffect fire twice on mount?',
    options: [
      'It is a bug in React',
      'React mounts, unmounts, then remounts to verify cleanup functions work correctly',
      'Strict Mode runs effects synchronously requiring two passes',
      'Strict Mode enables concurrent features that schedule effects twice'
    ],
    answer: 'React mounts, unmounts, then remounts to verify cleanup functions work correctly',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'React Strict Mode intentionally double-invokes effects (mount→cleanup→mount) in development to help detect effects that lack proper cleanup and would break when the component remounts.',
    references: ['https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development']
  },
  {
    level: 'MID',
    topic: 'Hooks',
    subtopic: 'useEffect',
    type: 'mcq',
    prompt: 'Which pattern correctly fetches data and avoids a state update after unmount?',
    options: [
      'useEffect(() => { fetch(url).then(res => setState(res)) }, [url])',
      'useEffect(() => { let mounted = true; fetch(url).then(res => { if (mounted) setState(res) }); return () => { mounted = false } }, [url])',
      'useEffect(async () => { const res = await fetch(url); setState(res) }, [url])',
      'useEffect(() => { fetch(url).then(res => setState(res)) }, [])'
    ],
    answer: 'useEffect(() => { let mounted = true; fetch(url).then(res => { if (mounted) setState(res) }); return () => { mounted = false } }, [url])',
    difficulty: 'medium',
    estimatedTime: 90,
    explanation: 'The mounted flag pattern prevents setting state on an unmounted component. Note: async useEffect callbacks are not directly supported — you need a wrapper function or the abort controller pattern.',
    references: ['https://react.dev/learn/you-might-not-need-an-effect#fetching-data']
  },

  // ── useCallback / useMemo ──────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Hooks',
    subtopic: 'useMemo',
    type: 'mcq',
    prompt: 'What does `useMemo` return?',
    options: [
      'A memoized callback function',
      'The memoized result of a computation',
      'A ref object that persists across renders',
      'A Promise'
    ],
    answer: 'The memoized result of a computation',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'useMemo caches the return value of a computation. useCallback caches the function itself. They are different tools.',
    references: ['https://react.dev/reference/react/useMemo']
  },
  {
    level: 'MID',
    topic: 'Hooks',
    subtopic: 'useCallback',
    type: 'mcq',
    prompt: 'When is `useCallback` MOST useful?',
    options: [
      'Whenever you define a function inside a component',
      'When passing a stable callback reference to a memoized child to prevent unnecessary re-renders',
      'When you need to memoize an expensive calculation result',
      'When you want a function to only run once on mount'
    ],
    answer: 'When passing a stable callback reference to a memoized child to prevent unnecessary re-renders',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'useCallback is primarily useful when combined with React.memo on child components. Without memo on the child, a stable function reference does not prevent re-renders.',
    references: ['https://react.dev/reference/react/useCallback#should-you-add-usecallback-everywhere']
  },

  // ── useRef ────────────────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Hooks',
    subtopic: 'useRef',
    type: 'mcq',
    prompt: 'Which of the following is a valid use case for `useRef`?',
    options: [
      'Storing data that should trigger a re-render when changed',
      'Replacing useState for simpler state management',
      'Storing a mutable value that persists across renders without triggering re-renders',
      'Running code after the component renders'
    ],
    answer: 'Storing a mutable value that persists across renders without triggering re-renders',
    difficulty: 'easy',
    estimatedTime: 45,
    explanation: 'useRef returns a mutable ref object whose `.current` property does not cause re-renders when mutated. It is commonly used for DOM references and storing interval/timeout IDs.',
    references: ['https://react.dev/reference/react/useRef']
  },
  {
    level: 'MID',
    topic: 'Hooks',
    subtopic: 'useRef',
    type: 'mcq',
    prompt: 'When can you safely read or write to a DOM ref created with `useRef`?',
    options: [
      'During render',
      'In the component function body before the return statement',
      'After the component mounts — inside useEffect or event handlers',
      'During server-side rendering'
    ],
    answer: 'After the component mounts — inside useEffect or event handlers',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'React attaches DOM nodes to refs after the component renders and commits to the DOM. Reading refs during render is unreliable and may cause hydration mismatches.',
    references: ['https://react.dev/learn/manipulating-the-dom-with-refs#when-react-attaches-the-refs']
  },

  // ── useContext ────────────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Hooks',
    subtopic: 'useContext',
    type: 'mcq',
    prompt: 'A component using `useContext(ThemeContext)` will re-render when:',
    options: [
      'Any state in the app changes',
      'The nearest ThemeContext.Provider re-renders, regardless of value change',
      'The context value changes (using Object.is comparison)',
      'The component\'s own state changes'
    ],
    answer: 'The context value changes (using Object.is comparison)',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'useContext causes a re-render only when the context value changes. React uses Object.is to compare old and new values. Passing a new object literal on every render (e.g., value={{ theme }}) will always trigger re-renders.',
    references: ['https://react.dev/reference/react/useContext#optimizing-re-renders-when-passing-objects-and-functions']
  },
  {
    level: 'MID',
    topic: 'Hooks',
    subtopic: 'useContext',
    type: 'mcq',
    prompt: 'What value does `useContext` return when no Provider is found in the tree?',
    options: [
      'null',
      'undefined',
      'The default value provided to createContext()',
      'It throws an error'
    ],
    answer: 'The default value provided to createContext()',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'When there is no matching Provider above the component in the tree, useContext returns the defaultValue passed to createContext(defaultValue).',
    references: ['https://react.dev/reference/react/useContext#usage']
  },

  // ── useReducer ────────────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Hooks',
    subtopic: 'useReducer',
    type: 'mcq',
    prompt: 'When should you prefer `useReducer` over `useState`?',
    options: [
      'When state is a primitive value like a number or string',
      'When next state depends on the previous state and involves multiple sub-values',
      'When you need to fetch data from an API',
      'Always — useReducer is strictly more powerful'
    ],
    answer: 'When next state depends on the previous state and involves multiple sub-values',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'useReducer is preferred for complex state logic: multiple sub-values, transitions that depend on previous state, or when the next state logic is complex enough to test in isolation.',
    references: ['https://react.dev/learn/extracting-state-logic-into-a-reducer']
  },

  // ── Component patterns ────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Component Patterns',
    subtopic: 'Controlled vs Uncontrolled',
    type: 'mcq',
    prompt: 'What is a "controlled component" in React?',
    options: [
      'A component wrapped in React.memo',
      'A form element whose value is driven by React state',
      'A component that cannot receive props from its parent',
      'A component rendered inside a Portal'
    ],
    answer: 'A form element whose value is driven by React state',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'A controlled component has its form data handled by React state. The component\'s value is always in sync with the state, and an onChange handler updates the state.',
    references: ['https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components']
  },
  {
    level: 'MID',
    topic: 'Component Patterns',
    subtopic: 'Lifting State',
    type: 'mcq',
    prompt: 'Two sibling components need to share the same state. What is the React-recommended approach?',
    options: [
      'Use localStorage to share state between them',
      'Create a global variable outside the component tree',
      'Lift the state up to their closest common ancestor and pass it down via props',
      'Use useRef to create a shared mutable object'
    ],
    answer: 'Lift the state up to their closest common ancestor and pass it down via props',
    difficulty: 'easy',
    estimatedTime: 45,
    explanation: '"Lifting state up" means moving shared state to the closest common ancestor so both siblings can receive it as props and a callback to update it.',
    references: ['https://react.dev/learn/sharing-state-between-components']
  },
  {
    level: 'MID',
    topic: 'Component Patterns',
    subtopic: 'Composition',
    type: 'mcq',
    prompt: 'What is the `children` prop in React?',
    options: [
      'A lifecycle method for child components',
      'A special prop containing JSX elements passed between the opening and closing tags of a component',
      'A hook for accessing child component instances',
      'A prop automatically added by React to track component hierarchy'
    ],
    answer: 'A special prop containing JSX elements passed between the opening and closing tags of a component',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'The children prop holds whatever JSX is placed between a component\'s opening and closing tags. It enables composition patterns.',
    references: ['https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children']
  },
  {
    level: 'MID',
    topic: 'Component Patterns',
    subtopic: 'React.memo',
    type: 'mcq',
    prompt: 'What does `React.memo` do?',
    options: [
      'Memoizes the result of an expensive calculation inside a component',
      'Prevents a functional component from re-rendering if its props have not changed (shallow comparison)',
      'Caches component instances between route changes',
      'Replaces shouldComponentUpdate in class components'
    ],
    answer: 'Prevents a functional component from re-rendering if its props have not changed (shallow comparison)',
    difficulty: 'easy',
    estimatedTime: 45,
    explanation: 'React.memo is a higher-order component that skips re-rendering when props are shallowly equal. It does not affect renders triggered by state or context changes inside the component.',
    references: ['https://react.dev/reference/react/memo']
  },
  {
    level: 'MID',
    topic: 'Component Patterns',
    subtopic: 'Forwarding Refs',
    type: 'mcq',
    prompt: 'Why would you use `React.forwardRef`?',
    options: [
      'To share state between parent and child components',
      'To allow a parent to access a DOM node inside a child component via a ref',
      'To forward props from one component to another without destructuring',
      'To avoid prop drilling'
    ],
    answer: 'To allow a parent to access a DOM node inside a child component via a ref',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'forwardRef lets a component expose a DOM node (or custom imperative handle) to its parent via the ref prop. Without it, refs on custom components do not attach to anything.',
    references: ['https://react.dev/reference/react/forwardRef']
  },
  {
    level: 'MID',
    topic: 'Component Patterns',
    subtopic: 'Keys',
    type: 'mcq',
    prompt: 'What is the correct way to use keys in lists?',
    options: [
      'Use the array index as the key — it is always the safest option',
      'Use a stable, unique identifier from the data (e.g., item.id)',
      'Keys are optional and only needed for performance optimization',
      'Use Math.random() to ensure keys are always unique'
    ],
    answer: 'Use a stable, unique identifier from the data (e.g., item.id)',
    difficulty: 'easy',
    estimatedTime: 45,
    explanation: 'Keys must be stable (same across renders), unique among siblings, and not derived from indexes if the list can reorder. Using index as key causes bugs with sorting, filtering, and focused inputs.',
    references: ['https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key']
  },
  {
    level: 'MID',
    topic: 'Component Patterns',
    subtopic: 'Keys',
    type: 'mcq',
    prompt: 'A developer uses array index as a key on a list of form inputs. When an item is deleted from the middle of the list, what bug might occur?',
    options: [
      'The wrong item is removed from the DOM',
      'React throws a duplicate key error',
      'Input values shift: the deleted item\'s value appears in the next input',
      'The list fails to re-render'
    ],
    answer: 'Input values shift: the deleted item\'s value appears in the next input',
    difficulty: 'medium',
    estimatedTime: 90,
    explanation: 'When using index as key, React reuses DOM nodes by position. Deleting item at index 1 makes item 2 take key 1, so React patches that node and its uncontrolled input retains the old value.',
    references: ['https://react.dev/learn/rendering-lists#why-does-react-need-keys']
  },

  // ── Events ────────────────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Events',
    subtopic: 'Synthetic Events',
    type: 'mcq',
    prompt: 'What is the correct way to prevent the default browser behavior in a React event handler?',
    options: [
      'return false from the event handler',
      'Call event.preventDefault()',
      'Set event.cancel = true',
      'Call event.stopPropagation()'
    ],
    answer: 'Call event.preventDefault()',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'In React, you must call event.preventDefault() explicitly. Unlike in plain HTML, returning false from a React event handler does not prevent default behavior.',
    references: ['https://react.dev/learn/responding-to-events#preventing-default-behavior']
  },
  {
    level: 'MID',
    topic: 'Events',
    subtopic: 'Event Bubbling',
    type: 'mcq',
    prompt: 'What does `event.stopPropagation()` do?',
    options: [
      'Prevents the event from reaching the target element',
      'Stops the event from bubbling up to parent elements',
      'Prevents the default browser action',
      'Removes the event listener after it fires once'
    ],
    answer: 'Stops the event from bubbling up to parent elements',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'stopPropagation() stops the event from bubbling up the DOM tree, preventing parent handlers from being called. It does not prevent the default action (use preventDefault for that).',
    references: ['https://react.dev/learn/responding-to-events#stopping-propagation']
  },

  // ── Forms ─────────────────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Forms',
    subtopic: 'Controlled inputs',
    type: 'mcq',
    prompt: 'You have `<input value={name} onChange={e => setName(e.target.value)} />`. What happens if you remove the `onChange` handler?',
    options: [
      'The input becomes read-only and the user cannot type in it',
      'The input works normally but React warns in the console',
      'The input loses its controlled status and becomes uncontrolled',
      'React throws an error during render'
    ],
    answer: 'The input becomes read-only and the user cannot type in it',
    difficulty: 'easy',
    estimatedTime: 45,
    explanation: 'A controlled input with a value prop but no onChange becomes read-only. React keeps the DOM value in sync with the state prop, preventing user edits. React also shows a warning.',
    references: ['https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable']
  },
  {
    level: 'MID',
    topic: 'Forms',
    subtopic: 'Form submission',
    type: 'mcq',
    prompt: 'How do you handle form submission in React without a page reload?',
    options: [
      'Add `action=""` to the form element',
      'Handle the `onSubmit` event and call `event.preventDefault()`',
      'Use the `onAction` prop on the submit button',
      'Add `type="button"` to the submit button'
    ],
    answer: 'Handle the `onSubmit` event and call `event.preventDefault()`',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'Attach an onSubmit handler to the <form> element and call event.preventDefault() to stop the default browser form submission (page reload). Then handle the data in React.',
    references: ['https://react.dev/learn/reacting-to-input-with-state']
  },

  // ── Conditional rendering ─────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Rendering',
    subtopic: 'Conditional Rendering',
    type: 'mcq',
    prompt: 'What does this JSX render when `count = 0`: `{count && <Spinner />}`?',
    options: [
      'Nothing — 0 is falsy so the Spinner is not rendered',
      'The number `0` is rendered to the DOM',
      '<Spinner /> is rendered',
      'null is rendered'
    ],
    answer: 'The number `0` is rendered to the DOM',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'In JavaScript, 0 && expr evaluates to 0 (not false). React renders 0 as a text node. Use `count > 0 && <Spinner />` or `!!count && <Spinner />` to avoid this.',
    references: ['https://react.dev/learn/conditional-rendering#logical-and-operator-']
  },
  {
    level: 'MID',
    topic: 'Rendering',
    subtopic: 'Lists',
    type: 'mcq',
    prompt: 'What does React render when a component returns `null`?',
    options: [
      'An empty div element',
      'The text "null"',
      'Nothing — the component renders no DOM output',
      'A React error boundary fallback'
    ],
    answer: 'Nothing — the component renders no DOM output',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'Returning null from a component is a valid way to render nothing. The component still mounts/unmounts normally and can still run hooks.',
    references: ['https://react.dev/learn/conditional-rendering#conditionally-returning-nothing-with-null']
  },

  // ── Props ─────────────────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Props',
    subtopic: 'Prop drilling',
    type: 'mcq',
    prompt: 'What is "prop drilling" and why is it a problem?',
    options: [
      'Passing too many props causes React to throw a performance warning',
      'Passing props through many intermediate components that do not use them, causing maintenance burden',
      'Drilling into a prop object with nested dot notation',
      'A technique for optimizing prop comparisons in React.memo'
    ],
    answer: 'Passing props through many intermediate components that do not use them, causing maintenance burden',
    difficulty: 'easy',
    estimatedTime: 45,
    explanation: 'Prop drilling occurs when data must be passed through many layers of components to reach a deeply nested consumer. Context API, state management libraries, or component composition are common solutions.',
    references: ['https://react.dev/learn/passing-data-deeply-with-context']
  },
  {
    level: 'MID',
    topic: 'Props',
    subtopic: 'Default props',
    type: 'mcq',
    prompt: 'How do you define default prop values in a modern functional component?',
    options: [
      'Component.defaultProps = { color: "red" }',
      'Using default parameter values in function destructuring: `function Btn({ color = "red" })`',
      'Both options are equally preferred',
      'Using a defaultProps hook'
    ],
    answer: 'Using default parameter values in function destructuring: `function Btn({ color = "red" })`',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'Modern React uses JavaScript default parameter values for functional components. The legacy `Component.defaultProps` approach still works but is being deprecated for function components.',
    references: ['https://react.dev/reference/react/Component#static-defaultprops']
  },

  // ── Performance ───────────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Performance',
    subtopic: 'Reconciliation',
    type: 'mcq',
    prompt: 'What is React reconciliation?',
    options: [
      'The process of merging state updates from multiple components',
      'The algorithm React uses to diff the virtual DOM and update the real DOM efficiently',
      'The process of loading a component\'s code asynchronously',
      'The mechanism for synchronising context across providers'
    ],
    answer: 'The algorithm React uses to diff the virtual DOM and update the real DOM efficiently',
    difficulty: 'easy',
    estimatedTime: 45,
    explanation: 'Reconciliation is React\'s algorithm that compares the previous and new virtual DOM trees and determines the minimal set of DOM changes needed to match the new tree.',
    references: ['https://react.dev/learn/preserving-and-resetting-state']
  },
  {
    level: 'MID',
    topic: 'Performance',
    subtopic: 'Code splitting',
    type: 'mcq',
    prompt: 'Which React API enables lazy loading of a component?',
    options: [
      'React.suspend()',
      'React.lazy() with Suspense',
      'React.defer()',
      'React.async()'
    ],
    answer: 'React.lazy() with Suspense',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'React.lazy() lets you defer loading a component until it is first rendered. It must be wrapped in a Suspense boundary that shows a fallback while loading.',
    references: ['https://react.dev/reference/react/lazy']
  },
  {
    level: 'MID',
    topic: 'Performance',
    subtopic: 'Memoization',
    type: 'mcq',
    prompt: 'A parent component has expensive state that changes frequently. A child component receives stable props and does expensive rendering. What is the best optimization?',
    options: [
      'Move the expensive state into a separate context',
      'Wrap the child in React.memo so it skips re-rendering when its props are unchanged',
      'Use useEffect in the child to check if re-rendering is necessary',
      'Split the parent into two separate apps'
    ],
    answer: 'Wrap the child in React.memo so it skips re-rendering when its props are unchanged',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'React.memo performs a shallow comparison of props before re-rendering. When the parent re-renders but the child\'s props are the same, the memoized child skips its render.',
    references: ['https://react.dev/reference/react/memo']
  },

  // ── State management ──────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'State Management',
    subtopic: 'Immutability',
    type: 'mcq',
    prompt: 'Why should you treat React state as immutable?',
    options: [
      'JavaScript objects are frozen by React and cannot be mutated',
      'React compares state by reference — mutating state directly prevents React from detecting changes and triggering re-renders',
      'Mutations cause memory leaks in the virtual DOM',
      'It is just a convention with no technical reason'
    ],
    answer: 'React compares state by reference — mutating state directly prevents React from detecting changes and triggering re-renders',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'React uses Object.is to compare state. Directly mutating state (e.g., state.items.push(x)) keeps the same reference, so React thinks state hasn\'t changed and skips re-rendering.',
    references: ['https://react.dev/learn/updating-objects-in-state#why-is-mutating-state-not-recommended-in-react']
  },
  {
    level: 'MID',
    topic: 'State Management',
    subtopic: 'Immutability',
    type: 'mcq',
    prompt: 'How do you correctly update a nested object in React state?',
    options: [
      'state.user.name = "Alice"; setState(state)',
      'setState({ ...state, user: { ...state.user, name: "Alice" } })',
      'setState(Object.assign(state, { user: { name: "Alice" } }))',
      'useState allows direct mutation — React detects deep changes automatically'
    ],
    answer: 'setState({ ...state, user: { ...state.user, name: "Alice" } })',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'You must create a new object at every level you want to update. Spread at each nested level to produce a new reference without mutating the original.',
    references: ['https://react.dev/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax']
  },
  {
    level: 'MID',
    topic: 'State Management',
    subtopic: 'Derived state',
    type: 'mcq',
    prompt: 'You have `items` in state and need to show filtered items. What is the best approach?',
    options: [
      'Store filtered items in a separate state variable and sync with useEffect',
      'Compute filtered items directly during render from the items state',
      'Store filtered items in a ref',
      'Use a separate useReducer for the filtered state'
    ],
    answer: 'Compute filtered items directly during render from the items state',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Derived state (data computed from other state) should be calculated during render, not stored separately. Storing derived state creates sync bugs and unnecessary complexity.',
    references: ['https://react.dev/learn/you-might-not-need-an-effect#caching-expensive-calculations']
  },

  // ── Custom hooks ──────────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Custom Hooks',
    subtopic: 'Naming convention',
    type: 'mcq',
    prompt: 'What is the naming requirement for a custom hook?',
    options: [
      'It must end with "Hook" (e.g., FetchDataHook)',
      'It must start with "use" (e.g., useFetchData)',
      'It must be exported from a file named hooks.ts',
      'There is no naming requirement'
    ],
    answer: 'It must start with "use" (e.g., useFetchData)',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'React requires custom hooks to start with "use" so the linter can enforce the rules of hooks (no conditional calls, no calls inside non-hook functions).',
    references: ['https://react.dev/learn/reusing-logic-with-custom-hooks#hook-names-always-start-with-use']
  },
  {
    level: 'MID',
    topic: 'Custom Hooks',
    subtopic: 'Sharing logic',
    type: 'mcq',
    prompt: 'Two components both need to subscribe to window resize events. What is the best approach?',
    options: [
      'Copy the useEffect subscription code into both components',
      'Extract the subscription logic into a custom hook (e.g., useWindowSize) and use it in both',
      'Use a class component with componentDidMount for shared lifecycle logic',
      'Create a global event listener outside of React'
    ],
    answer: 'Extract the subscription logic into a custom hook (e.g., useWindowSize) and use it in both',
    difficulty: 'easy',
    estimatedTime: 45,
    explanation: 'Custom hooks are the React mechanism for sharing stateful logic between components without duplicating code. Each component that calls the hook gets its own independent state.',
    references: ['https://react.dev/learn/reusing-logic-with-custom-hooks']
  },

  // ── Error Boundaries ──────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Error Handling',
    subtopic: 'Error Boundaries',
    type: 'mcq',
    prompt: 'Error Boundaries in React can catch errors thrown in:',
    options: [
      'Event handlers, async code, and render methods',
      'Render methods, lifecycle methods, and constructors of child components',
      'Only event handlers',
      'Only async operations like fetch calls'
    ],
    answer: 'Render methods, lifecycle methods, and constructors of child components',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Error Boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them. They do NOT catch errors in event handlers or async code.',
    references: ['https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary']
  },
  {
    level: 'MID',
    topic: 'Error Handling',
    subtopic: 'Error Boundaries',
    type: 'mcq',
    prompt: 'As of React 19, how do you implement an Error Boundary?',
    options: [
      'Using a functional component with try/catch',
      'Using the useErrorBoundary hook',
      'Using a class component that implements getDerivedStateFromError or componentDidCatch',
      'Wrapping the component in React.errorBoundary()'
    ],
    answer: 'Using a class component that implements getDerivedStateFromError or componentDidCatch',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Error Boundaries must still be class components as of React 19 — there is no hook equivalent yet. Libraries like react-error-boundary provide a functional wrapper over the class component.',
    references: ['https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary']
  },

  // ── Portals ───────────────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Portals',
    subtopic: 'createPortal',
    type: 'mcq',
    prompt: 'What is a React Portal used for?',
    options: [
      'Rendering a component in a separate browser window',
      'Rendering children into a different DOM node outside the parent component\'s DOM hierarchy',
      'Creating lazy-loaded route segments',
      'Teleporting state between components'
    ],
    answer: 'Rendering children into a different DOM node outside the parent component\'s DOM hierarchy',
    difficulty: 'easy',
    estimatedTime: 45,
    explanation: 'Portals (createPortal) render JSX into a different DOM node while preserving React context and event bubbling behavior from the portal\'s position in the React tree.',
    references: ['https://react.dev/reference/react-dom/createPortal']
  },

  // ── Suspense ──────────────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Suspense',
    subtopic: 'Fallback',
    type: 'mcq',
    prompt: 'What does the `fallback` prop of `<Suspense>` do?',
    options: [
      'Renders when there is an error in the suspended component',
      'Renders while waiting for a lazy component or data to load',
      'Provides a default value for context consumers',
      'Specifies the loading priority of the suspended content'
    ],
    answer: 'Renders while waiting for a lazy component or data to load',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'The fallback prop accepts any React node (typically a spinner or skeleton) that renders while the suspended content is loading.',
    references: ['https://react.dev/reference/react/Suspense']
  },

  // ── React 18+ features ────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'React 18+',
    subtopic: 'Automatic Batching',
    type: 'mcq',
    prompt: 'What does "automatic batching" in React 18 mean?',
    options: [
      'React automatically installs performance-monitoring tools',
      'Multiple state updates in the same event are batched into a single re-render — even inside setTimeout, Promises, and native event handlers',
      'React batches network requests to reduce API calls',
      'Components are automatically wrapped in React.memo'
    ],
    answer: 'Multiple state updates in the same event are batched into a single re-render — even inside setTimeout, Promises, and native event handlers',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'React 17 only batched inside React event handlers. React 18 extends batching to all cases. Use ReactDOM.flushSync() to opt out of batching when needed.',
    references: ['https://react.dev/blog/2022/03/29/react-v18#new-feature-automatic-batching']
  },
  {
    level: 'MID',
    topic: 'React 18+',
    subtopic: 'useId',
    type: 'mcq',
    prompt: 'What is `useId` used for?',
    options: [
      'Generating unique user authentication IDs',
      'Generating stable, unique IDs for accessibility attributes like aria-labelledby',
      'Tracking component instance IDs for debugging',
      'Creating unique database record IDs'
    ],
    answer: 'Generating stable, unique IDs for accessibility attributes like aria-labelledby',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'useId generates a unique, stable ID that is consistent between server and client rendering. It is designed for accessibility attributes (aria-*, htmlFor) and NOT for list keys.',
    references: ['https://react.dev/reference/react/useId']
  },

  // ── Testing ───────────────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Testing',
    subtopic: 'React Testing Library',
    type: 'mcq',
    prompt: 'What is the primary philosophy of React Testing Library?',
    options: [
      'Test implementation details to ensure components behave correctly internally',
      'Test components the way users interact with them — by querying by role, text, and label',
      'Use shallow rendering to isolate component logic from its children',
      'Mock all hooks and side effects for fast unit tests'
    ],
    answer: 'Test components the way users interact with them — by querying by role, text, and label',
    difficulty: 'easy',
    estimatedTime: 45,
    explanation: 'RTL encourages testing from the user\'s perspective using accessible queries (getByRole, getByText, getByLabelText). This avoids testing implementation details that may change without breaking UX.',
    references: ['https://testing-library.com/docs/guiding-principles']
  },
  {
    level: 'MID',
    topic: 'Testing',
    subtopic: 'React Testing Library',
    type: 'mcq',
    prompt: 'Which query should you prefer in React Testing Library for accessible elements?',
    options: [
      'getByTestId — it is the most stable query',
      'getByRole — it mirrors how assistive technologies access elements',
      'getByClassName — it tests actual rendering output',
      'getByDOMId — it tests unique element identification'
    ],
    answer: 'getByRole — it mirrors how assistive technologies access elements',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'getByRole is the recommended primary query. It works the way screen readers do and doubles as an accessibility check. getByTestId should be a last resort.',
    references: ['https://testing-library.com/docs/queries/about#priority']
  },
  {
    level: 'MID',
    topic: 'Testing',
    subtopic: 'Async testing',
    type: 'mcq',
    prompt: 'How do you test a component that shows data after an async fetch?',
    options: [
      'Use setTimeout in the test to wait for the fetch to complete',
      'Use waitFor() or findBy* queries from RTL to wait for elements to appear',
      'Disable async behavior in the test environment',
      'Render the component twice — once before and once after the fetch'
    ],
    answer: 'Use waitFor() or findBy* queries from RTL to wait for elements to appear',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'findBy* queries return a promise that resolves when the element appears. waitFor() polls the callback until it passes. Both handle the async nature of data fetching correctly.',
    references: ['https://testing-library.com/docs/dom-testing-library/api-async']
  },
  {
    level: 'MID',
    topic: 'Testing',
    subtopic: 'Mocking',
    type: 'mcq',
    prompt: 'You want to test a component that calls `fetch`. What is the best approach?',
    options: [
      'Make real network calls in tests for accuracy',
      'Mock the global fetch function or use MSW (Mock Service Worker) to intercept requests',
      'Move fetch logic to a HOC to make the base component testable',
      'Test only the logic in useEffect, not the fetch call itself'
    ],
    answer: 'Mock the global fetch function or use MSW (Mock Service Worker) to intercept requests',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Unit/integration tests should not depend on real network calls. MSW intercepts at the network level and is the most realistic mocking approach. vi.fn() or jest.fn() on global fetch is simpler but less realistic.',
    references: ['https://mswjs.io/docs/getting-started']
  },

  // ── JSX / Rendering ───────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'JSX',
    subtopic: 'JSX transformation',
    type: 'mcq',
    prompt: 'In modern React (17+), do you need to import React to use JSX?',
    options: [
      'Yes — JSX always compiles to React.createElement which requires React in scope',
      'No — the new JSX transform automatically imports the jsx runtime, no manual import needed',
      'Only in TypeScript projects',
      'Only when using Babel'
    ],
    answer: 'No — the new JSX transform automatically imports the jsx runtime, no manual import needed',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'React 17 introduced the new JSX transform (jsx-runtime) that inserts the necessary import automatically. You no longer need `import React from "react"` at the top of every file just for JSX.',
    references: ['https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html']
  },
  {
    level: 'MID',
    topic: 'JSX',
    subtopic: 'Fragments',
    type: 'mcq',
    prompt: 'When would you use a React Fragment (`<>...</>`) instead of a `<div>`?',
    options: [
      'When you need to apply CSS styles to the wrapper element',
      'When you need to group multiple elements without adding an extra DOM node',
      'When the children need event listeners on the wrapper',
      'When using server-side rendering'
    ],
    answer: 'When you need to group multiple elements without adding an extra DOM node',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'Fragments let you return multiple elements from a component without adding extra nodes to the DOM. This avoids invalid HTML (e.g., extra divs inside table rows) and reduces DOM depth.',
    references: ['https://react.dev/reference/react/Fragment']
  },

  // ── Component lifecycle ───────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Component Lifecycle',
    subtopic: 'Mount / Unmount',
    type: 'mcq',
    prompt: 'In React, what happens to component state when a component unmounts?',
    options: [
      'State is preserved in memory and restored when the component remounts',
      'State is serialized to localStorage automatically',
      'State is destroyed — the component starts fresh if remounted',
      'State is moved to the parent component'
    ],
    answer: 'State is destroyed — the component starts fresh if remounted',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'When a component unmounts, React destroys its state. If the same component remounts later (or after a key change), it starts with fresh state from the initial value.',
    references: ['https://react.dev/learn/preserving-and-resetting-state']
  },
  {
    level: 'MID',
    topic: 'Component Lifecycle',
    subtopic: 'Key reset',
    type: 'mcq',
    prompt: 'How can you force React to fully unmount and remount a component, resetting its state?',
    options: [
      'Call component.forceUpdate()',
      'Set the component\'s `reset` prop to true',
      'Change the component\'s `key` prop',
      'Call setState with the initial value'
    ],
    answer: 'Change the component\'s `key` prop',
    difficulty: 'medium',
    estimatedTime: 45,
    explanation: 'When a component\'s key changes, React treats it as a completely different component — it unmounts the old one and mounts a fresh one. This is the idiomatic way to reset a component\'s state.',
    references: ['https://react.dev/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key']
  },

  // ── Accessibility ─────────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Accessibility',
    subtopic: 'ARIA',
    type: 'mcq',
    prompt: 'You render a loading spinner. What ARIA attribute should it have for accessibility?',
    options: [
      'aria-disabled="true"',
      'role="status" with aria-live="polite" or aria-label describing the loading state',
      'tabindex="-1"',
      'aria-hidden="true"'
    ],
    answer: 'role="status" with aria-live="polite" or aria-label describing the loading state',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Spinners should have role="status" (or aria-live="polite") so screen readers announce the loading state. Adding aria-label or visually hidden text describes what is loading.',
    references: ['https://www.w3.org/WAI/ARIA/apg/patterns/spinners/']
  },
  {
    level: 'MID',
    topic: 'Accessibility',
    subtopic: 'Labels',
    type: 'mcq',
    prompt: 'What is the correct way to associate a label with an input for accessibility?',
    options: [
      'Place the label text next to the input with CSS',
      'Use `<label htmlFor="inputId">` with `<input id="inputId">`, or wrap the input inside the label',
      'Use aria-placeholder on the input',
      'Set the title attribute on the input'
    ],
    answer: 'Use `<label htmlFor="inputId">` with `<input id="inputId">`, or wrap the input inside the label',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'Proper label association ensures screen readers announce the label when the input is focused. In React, use htmlFor (not the HTML for attribute) on the label element.',
    references: ['https://react.dev/reference/react-dom/components/input#providing-a-label-for-an-input']
  },

  // ── TypeScript with React ─────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'TypeScript',
    subtopic: 'Component props',
    type: 'mcq',
    prompt: 'How do you type the `children` prop in a React TypeScript component?',
    options: [
      'children: JSX.Element',
      'children: React.ReactNode',
      'children: React.Component',
      'children: HTMLElement'
    ],
    answer: 'children: React.ReactNode',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'React.ReactNode is the broadest type for children — it accepts strings, numbers, JSX elements, arrays, null, undefined, and boolean. JSX.Element is narrower (only JSX).',
    references: ['https://react.dev/learn/typescript#typing-component-props']
  },
  {
    level: 'MID',
    topic: 'TypeScript',
    subtopic: 'Event types',
    type: 'mcq',
    prompt: 'What is the correct TypeScript type for a React input change handler?',
    options: [
      '(e: Event) => void',
      '(e: React.ChangeEvent<HTMLInputElement>) => void',
      '(e: InputEvent) => void',
      '(e: React.FormEvent) => void'
    ],
    answer: '(e: React.ChangeEvent<HTMLInputElement>) => void',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'React wraps native events in SyntheticEvents. For onChange on an <input>, use React.ChangeEvent<HTMLInputElement>. Access e.target.value with correct typing.',
    references: ['https://react.dev/learn/typescript#typing-dom-events']
  },
  {
    level: 'MID',
    topic: 'TypeScript',
    subtopic: 'useRef typing',
    type: 'mcq',
    prompt: 'How do you correctly type a ref for a DOM input element in TypeScript?',
    options: [
      'const ref = useRef<Element>(null)',
      'const ref = useRef<HTMLInputElement>(null)',
      'const ref = useRef<InputElement>(null)',
      'const ref = useRef(document.createElement("input"))'
    ],
    answer: 'const ref = useRef<HTMLInputElement>(null)',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'Pass the specific DOM element type as the generic argument to useRef. Initialize with null since the element does not exist during the first render.',
    references: ['https://react.dev/learn/typescript#typing-useref']
  },

  // ── Advanced patterns ─────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Patterns',
    subtopic: 'Render props',
    type: 'mcq',
    prompt: 'What is a "render prop" pattern?',
    options: [
      'Passing JSX elements as props to a component',
      'A component that accepts a function as a prop and calls it to determine what to render',
      'Using React.render() to render components imperatively',
      'A prop that contains the component\'s rendered output'
    ],
    answer: 'A component that accepts a function as a prop and calls it to determine what to render',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Render props allow sharing logic by passing a function prop that the component calls with its internal state. Custom hooks have largely replaced this pattern for sharing logic.',
    references: ['https://react.dev/reference/react/cloneElement#passing-data-with-a-render-prop']
  },
  {
    level: 'MID',
    topic: 'Patterns',
    subtopic: 'Higher Order Components',
    type: 'mcq',
    prompt: 'A Higher Order Component (HOC) is:',
    options: [
      'A component rendered at a higher position in the component tree',
      'A function that takes a component and returns a new component with additional capabilities',
      'A class component with extended lifecycle methods',
      'A component that uses the Context API'
    ],
    answer: 'A function that takes a component and returns a new component with additional capabilities',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'HOCs are a composition pattern where a function wraps a component to add behaviour (e.g., withRouter, connect). Custom hooks are now the preferred alternative in most cases.',
    references: ['https://react.dev/reference/react/cloneElement#alternatives']
  },

  // ── Server-side rendering ─────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'SSR',
    subtopic: 'Hydration',
    type: 'mcq',
    prompt: 'What is React hydration?',
    options: [
      'Loading React from a CDN to speed up the initial render',
      'The process of attaching React event handlers to server-rendered HTML without replacing the DOM',
      'Synchronizing server and client state using WebSockets',
      'Pre-populating localStorage with server data'
    ],
    answer: 'The process of attaching React event handlers to server-rendered HTML without replacing the DOM',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Hydration makes server-rendered HTML interactive by re-using the existing DOM nodes and attaching event listeners, avoiding a full client-side re-render.',
    references: ['https://react.dev/reference/react-dom/client/hydrateRoot']
  },

  // ── React 19 new features ─────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'React 19',
    subtopic: 'use hook',
    type: 'mcq',
    prompt: 'In React 19, the `use` hook can be called:',
    options: [
      'Only at the top level of a component like all other hooks',
      'Inside conditionals, loops, and after early returns — it is not a hook in the traditional sense',
      'Only inside Server Components',
      'Only for reading Context — not for Promises'
    ],
    answer: 'Inside conditionals, loops, and after early returns — it is not a hook in the traditional sense',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'The use() hook in React 19 is unique: it can be called conditionally and inside loops. It supports reading Promises (with Suspense) and Context values.',
    references: ['https://react.dev/reference/react/use']
  },
  {
    level: 'MID',
    topic: 'React 19',
    subtopic: 'Actions',
    type: 'mcq',
    prompt: 'What are React 19 "Actions" and `useActionState`?',
    options: [
      'Redux action creators integrated into React core',
      'A pattern for handling async transitions from form submissions, with built-in pending/error state management',
      'WebSocket message handlers for real-time state updates',
      'A replacement for useReducer with remote state syncing'
    ],
    answer: 'A pattern for handling async transitions from form submissions, with built-in pending/error state management',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'React 19 Actions allow forms to have async action functions. useActionState wraps an action and provides pending state, error state, and the updated state value automatically.',
    references: ['https://react.dev/reference/react/useActionState']
  },
  {
    level: 'MID',
    topic: 'React 19',
    subtopic: 'useOptimistic',
    type: 'mcq',
    prompt: 'What does `useOptimistic` do in React 19?',
    options: [
      'Speeds up rendering by skipping non-critical updates',
      'Allows showing an optimistic UI immediately while an async operation is in progress, then reverts if it fails',
      'Caches component output to avoid re-renders',
      'Automatically retries failed network requests'
    ],
    answer: 'Allows showing an optimistic UI immediately while an async operation is in progress, then reverts if it fails',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'useOptimistic lets you show the expected outcome of a mutation immediately (e.g., adding an item to a list) while the server request is in flight, reverting to the actual state on completion or error.',
    references: ['https://react.dev/reference/react/useOptimistic']
  },
  {
    level: 'MID',
    topic: 'React 19',
    subtopic: 'ref as prop',
    type: 'mcq',
    prompt: 'In React 19, how has the way of passing refs to function components changed?',
    options: [
      'Refs must still use forwardRef — nothing has changed',
      'Function components can now receive ref as a regular prop without forwardRef',
      'Refs are now automatically forwarded to the first DOM element',
      'useRef is deprecated in favor of the new useSignal hook'
    ],
    answer: 'Function components can now receive ref as a regular prop without forwardRef',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'React 19 makes forwardRef unnecessary for function components. You can now accept ref as a regular prop: function Input({ ref, ...props }) { return <input ref={ref} {...props} /> }',
    references: ['https://react.dev/blog/2024/12/05/react-19#ref-as-a-prop']
  },

  // ── Virtual DOM ───────────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Internals',
    subtopic: 'Virtual DOM',
    type: 'mcq',
    prompt: 'The Virtual DOM is:',
    options: [
      'A direct representation of the real DOM stored in the browser\'s memory',
      'A lightweight JavaScript object tree that React uses to batch and minimize real DOM mutations',
      'A browser API that allows faster DOM updates',
      'A separate rendering thread that processes DOM updates asynchronously'
    ],
    answer: 'A lightweight JavaScript object tree that React uses to batch and minimize real DOM mutations',
    difficulty: 'easy',
    estimatedTime: 45,
    explanation: 'The Virtual DOM is React\'s in-memory representation of the UI. React diffs the old and new Virtual DOM trees (reconciliation) to compute the minimum changes needed to update the real DOM.',
    references: ['https://react.dev/learn/preserving-and-resetting-state']
  },

  // ── Context ───────────────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Context',
    subtopic: 'createContext',
    type: 'mcq',
    prompt: 'How do you update context value from a consumer component?',
    options: [
      'Call context.update() from the consumer',
      'Pass a state setter function as part of the context value from the Provider',
      'Context is read-only and cannot be updated from consumers',
      'Use the context.dispatch() method'
    ],
    answer: 'Pass a state setter function as part of the context value from the Provider',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'The common pattern is to put both the value and its setter in context: `<Context.Provider value={{ theme, setTheme }}>`. Consumers can then call setTheme to trigger updates.',
    references: ['https://react.dev/learn/scaling-up-with-reducer-and-context']
  },
  {
    level: 'MID',
    topic: 'Context',
    subtopic: 'Performance',
    type: 'mcq',
    prompt: 'Why does `<MyContext.Provider value={{ user, setUser }}>` cause extra re-renders?',
    options: [
      'Provider components always cause all children to re-render',
      'A new object literal `{ user, setUser }` is created on every parent render, causing all context consumers to re-render even when user and setUser haven\'t changed',
      'Context providers cannot hold functions as part of their value',
      'The Provider\'s internal caching is disabled when passing objects'
    ],
    answer: 'A new object literal `{ user, setUser }` is created on every parent render, causing all context consumers to re-render even when user and setUser haven\'t changed',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Because `{}` creates a new object reference each render, React sees a changed context value and re-renders all consumers. Fix with useMemo: `const value = useMemo(() => ({ user, setUser }), [user, setUser])`.',
    references: ['https://react.dev/reference/react/useContext#optimizing-re-renders-when-passing-objects-and-functions']
  },

  // ── StrictMode ────────────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Development Tools',
    subtopic: 'StrictMode',
    type: 'mcq',
    prompt: 'What does `React.StrictMode` do in production builds?',
    options: [
      'Enables additional runtime checks and warnings',
      'Nothing — StrictMode only activates in development',
      'Throws errors for deprecated APIs',
      'Enables the concurrent features engine'
    ],
    answer: 'Nothing — StrictMode only activates in development',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'StrictMode\'s checks (double-invoking renders/effects, detecting deprecated APIs) only run in development. It has zero performance impact in production builds.',
    references: ['https://react.dev/reference/react/StrictMode']
  },

  // ── Environment ───────────────────────────────────────────────────────────
  {
    level: 'MID',
    topic: 'Tooling',
    subtopic: 'Vite',
    type: 'mcq',
    prompt: 'What command creates a new Vite + React + TypeScript project?',
    options: [
      'npx create-react-app my-app --template typescript',
      'npm create vite@latest my-app -- --template react-ts',
      'npx react-scripts init my-app',
      'npm install vite react typescript && vite init'
    ],
    answer: 'npm create vite@latest my-app -- --template react-ts',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'The official Vite scaffolding command is `npm create vite@latest`. The `react-ts` template sets up React with TypeScript, Vite, and basic project structure.',
    references: ['https://vitejs.dev/guide/#scaffolding-your-first-vite-project']
  },
  {
    level: 'MID',
    topic: 'Tooling',
    subtopic: 'React DevTools',
    type: 'mcq',
    prompt: 'What can you inspect with React DevTools?',
    options: [
      'Network requests made by the application',
      'Component tree, props, state, hooks, and performance profiling',
      'CSS styles applied to elements',
      'Bundle size and code splitting information'
    ],
    answer: 'Component tree, props, state, hooks, and performance profiling',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'React DevTools lets you inspect the component hierarchy, view current props and state, inspect hooks, and profile rendering performance.',
    references: ['https://react.dev/learn/react-developer-tools']
  },

  // ── Additional MID-level questions ────────────────────────────────────────
  {
    level: 'MID',
    topic: 'State Management',
    subtopic: 'Update arrays',
    type: 'mcq',
    prompt: 'How do you correctly remove an item from an array in React state?',
    options: [
      'state.items.splice(index, 1); setState(state.items)',
      'setState(state.items.filter(item => item.id !== id))',
      'delete state.items[index]; setState(state.items)',
      'state.items.length = state.items.length - 1; setState(state.items)'
    ],
    answer: 'setState(state.items.filter(item => item.id !== id))',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'filter() returns a new array without mutating the original. This gives React a new reference to compare, triggering a re-render correctly.',
    references: ['https://react.dev/learn/updating-arrays-in-state#removing-from-an-array']
  },
  {
    level: 'MID',
    topic: 'State Management',
    subtopic: 'Update arrays',
    type: 'mcq',
    prompt: 'How do you correctly add an item to an array in React state?',
    options: [
      'state.items.push(newItem); setState(state.items)',
      'setState([...state.items, newItem])',
      'state.items[state.items.length] = newItem; setState(state)',
      'setState(state.items.concat) — concat mutates in place'
    ],
    answer: 'setState([...state.items, newItem])',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'Spread creates a new array with all existing items plus the new one, preserving immutability. concat() also works since it returns a new array without mutating.',
    references: ['https://react.dev/learn/updating-arrays-in-state#adding-to-an-array']
  },
  {
    level: 'MID',
    topic: 'Rendering',
    subtopic: 'Strict Mode double render',
    type: 'mcq',
    prompt: 'In StrictMode, why does React call the render function twice in development?',
    options: [
      'To compare output for consistency and detect components with side effects in render',
      'To pre-warm the component cache',
      'To test both the happy path and error path',
      'To enable time-travel debugging'
    ],
    answer: 'To compare output for consistency and detect components with side effects in render',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'StrictMode double-invokes render (and other pure functions) to surface components that produce different output on each call — indicating impure render functions with side effects.',
    references: ['https://react.dev/reference/react/StrictMode#detecting-impure-rendering-caused-by-impure-renders']
  },
  {
    level: 'MID',
    topic: 'Hooks',
    subtopic: 'Rules of Hooks',
    type: 'mcq',
    prompt: 'Which of the following violates the Rules of Hooks?',
    options: [
      'Calling useState at the top of a function component',
      'Calling useEffect inside an if statement conditionally',
      'Calling a custom hook from another custom hook',
      'Calling multiple useState hooks in a single component'
    ],
    answer: 'Calling useEffect inside an if statement conditionally',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Hooks must be called at the top level of a React function, not inside conditions, loops, or nested functions. React tracks hook calls by their order — conditional calls break that ordering.',
    references: ['https://react.dev/reference/rules/rules-of-hooks']
  },
  {
    level: 'MID',
    topic: 'Hooks',
    subtopic: 'useLayoutEffect',
    type: 'mcq',
    prompt: 'What is the difference between `useEffect` and `useLayoutEffect`?',
    options: [
      'useLayoutEffect runs asynchronously after paint; useEffect runs synchronously before paint',
      'useLayoutEffect fires synchronously after DOM mutations but before the browser paints; useEffect fires after paint',
      'useLayoutEffect is for CSS; useEffect is for data fetching',
      'They are identical — useLayoutEffect is an alias'
    ],
    answer: 'useLayoutEffect fires synchronously after DOM mutations but before the browser paints; useEffect fires after paint',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'useLayoutEffect runs before the browser has a chance to paint. Use it when you need to read layout information (e.g., element size) or make DOM changes that should happen synchronously before the user sees anything.',
    references: ['https://react.dev/reference/react/useLayoutEffect']
  },
  {
    level: 'MID',
    topic: 'Performance',
    subtopic: 'React Profiler',
    type: 'mcq',
    prompt: 'What does the React Profiler in DevTools help you identify?',
    options: [
      'JavaScript bundle size and tree shaking efficiency',
      'Which components re-render, how often, and how long each render takes',
      'Memory leaks in event listeners',
      'Accessibility violations in the component tree'
    ],
    answer: 'Which components re-render, how often, and how long each render takes',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'The React Profiler records rendering performance. It shows each component\'s render time, why it rendered ("what caused this render"), and helps identify unnecessary re-renders.',
    references: ['https://react.dev/reference/react/Profiler']
  }
]
