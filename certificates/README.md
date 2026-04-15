# React Certification Prep — certificates.dev MID + SENIOR

> **Exam Format:** 40 multiple-choice questions + 105 minutes of coding challenges
> **Levels:** Mid-Level React Developer | Senior React Developer

This folder is your self-contained preparation kit. Every topic has:
- A `README.md` with theory, key concepts, and exam traps
- `Challenge.tsx` files with guided TODOs to implement
- `Solution.tsx` files to check your work

---

## How to Use This Kit

1. **Read the README** for the topic — understand the concepts before coding
2. **Open the Challenge** — implement the TODOs without looking at the solution
3. **Check the Solution** — compare, note what you missed
4. **Re-read exam tips** at the bottom of each README

You can paste challenge/solution files directly into [StackBlitz](https://stackblitz.com) or a local Vite app.

---

## MID-Level Topics

| # | Topic | Status |
|---|-------|--------|
| 01 | [Hooks Deep Dive](./mid/01-hooks/README.md) | `useState`, `useEffect`, `useRef`, `useReducer`, `useContext`, `useMemo`, `useCallback` |
| 02 | [Component Patterns](./mid/02-component-patterns/README.md) | Compound, Render Props, HOC, Controlled vs Uncontrolled |
| 03 | [Performance Optimization](./mid/03-performance/README.md) | `memo`, `useMemo`, `useCallback`, `lazy`, code splitting |
| 04 | [Error Handling](./mid/04-error-handling/README.md) | Error Boundaries, Suspense fallbacks |
| 05 | [Forms](./mid/05-forms/README.md) | Controlled, uncontrolled, validation patterns |
| 06 | [Context & State Management](./mid/06-context-state/README.md) | Context API, `useReducer`, state lifting |

---

## SENIOR-Level Topics

| # | Topic | Status |
|---|-------|--------|
| 01 | [React 19 Actions](./senior/01-react-19-actions/README.md) | `useActionState`, `useOptimistic`, form actions, `use()` |
| 02 | [Concurrent Features](./senior/02-concurrent-features/README.md) | `useTransition`, `useDeferredValue`, `Suspense` |
| 03 | [React Server Components](./senior/03-server-components/README.md) | RSC, server/client boundary, serialization |
| 04 | [React Compiler](./senior/04-react-compiler/README.md) | Auto-memoization, rules of React |
| 05 | [Advanced Patterns](./senior/05-advanced-patterns/README.md) | Compound components, action props, forwarding refs |
| 06 | [Accessibility](./senior/06-accessibility/README.md) | ARIA, keyboard nav, focus management |
| 07 | [Testing](./senior/07-testing/README.md) | Unit, integration, testing hooks |

---

## Exam Tips (Both Levels)

- **Read the React docs** — the exam validates React's official patterns, not library-specific ones
- **Coding challenges test real-world thinking**, not just syntax — understand WHY not just HOW
- **Hooks rules** — always know: no hooks inside conditions or loops
- **Re-render triggers**: state change, prop change, parent re-render, context change
- **React 19** topics are heavily tested in Senior — `useActionState`, Actions, `useOptimistic`

---

## Resources

- [Official React Docs](https://react.dev)
- [certificates.dev Blog](https://certificates.dev/blog?tech=react)
- [React Hooks Cheatsheet](https://certificates.dev/cheat-sheets/react-hooks-cheatsheet-part-1)
- [React Concurrent Features Cheatsheet](https://certificates.dev/cheat-sheets/react-concurrent-features-cheatsheet-part-1)
