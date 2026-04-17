import type { QuestionInput } from '../../domain/question/question.schema.js'

type Difficulty = 'easy' | 'medium' | 'hard'
type QuestionSeed = Omit<QuestionInput, 'technologyId' | 'difficulty'> & { difficulty: Difficulty }

export const typescriptQuestions: QuestionSeed[] = [
  // ── Basic Types ───────────────────────────────────────────────────────────
  {
    level: 'FUNDAMENTALS',
    topic: 'Basic Types',
    subtopic: 'Primitives',
    type: 'mcq',
    prompt: 'Which TypeScript type describes a value that can never occur?',
    options: ['unknown', 'void', 'never', 'undefined'],
    answer: 'never',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: '`never` represents values that never occur — e.g., the return type of a function that always throws or has an infinite loop. It is also produced by exhaustive checks in discriminated unions.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type']
  },
  {
    level: 'FUNDAMENTALS',
    topic: 'Basic Types',
    subtopic: 'unknown vs any',
    type: 'mcq',
    prompt: 'What is the key difference between `any` and `unknown`?',
    options: [
      'unknown is the same as any but marks deprecated APIs',
      'any disables type checking; unknown is type-safe — you must narrow it before using it',
      'unknown can only hold primitive values; any can hold anything',
      'They are identical — unknown is just an alias for any'
    ],
    answer: 'any disables type checking; unknown is type-safe — you must narrow it before using it',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'unknown is the type-safe counterpart to any. You can assign anything to unknown, but you cannot use it without narrowing (type guard, typeof check, instanceof). any skips all checks.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown']
  },
  {
    level: 'FUNDAMENTALS',
    topic: 'Basic Types',
    subtopic: 'Type assertions',
    type: 'mcq',
    prompt: 'When should you use a type assertion (`value as Type`)?',
    options: [
      'Whenever TypeScript infers the wrong type',
      'When you have more information than TypeScript about a value\'s type and the assertion is safe',
      'As a replacement for proper typing — it\'s faster than writing interfaces',
      'To convert between incompatible types (e.g., string to number)'
    ],
    answer: 'When you have more information than TypeScript about a value\'s type and the assertion is safe',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Type assertions tell TypeScript "trust me, I know what this is." Use them sparingly and only when you are certain — they bypass type checking and can cause runtime errors if wrong.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions']
  },
  {
    level: 'FUNDAMENTALS',
    topic: 'Basic Types',
    subtopic: 'Literal types',
    type: 'mcq',
    prompt: 'What does `const direction = "north" as const` do?',
    options: [
      'Casts the string to a constant number',
      'Narrows the type from `string` to the literal type `"north"`',
      'Makes the variable immutable at runtime',
      'Prevents TypeScript from widening the type to string'
    ],
    answer: 'Narrows the type from `string` to the literal type `"north"`',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: '`as const` tells TypeScript to infer the most specific literal type rather than widening. Without it, `const x = "north"` has type `string`. With it, the type is the literal `"north"`.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types']
  },

  // ── Interfaces vs Types ───────────────────────────────────────────────────
  {
    level: 'FUNDAMENTALS',
    topic: 'Interfaces',
    subtopic: 'Interface vs Type alias',
    type: 'mcq',
    prompt: 'What can `interface` do that a `type` alias cannot?',
    options: [
      'Describe union types',
      'Use generics',
      'Declaration merging — multiple interface declarations with the same name are merged',
      'Extend other types'
    ],
    answer: 'Declaration merging — multiple interface declarations with the same name are merged',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Declaration merging allows multiple `interface Foo { ... }` declarations to automatically merge into one. Type aliases cannot be reopened. This is useful for augmenting library types.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces']
  },
  {
    level: 'FUNDAMENTALS',
    topic: 'Interfaces',
    subtopic: 'Extending',
    type: 'mcq',
    prompt: 'What is the TypeScript output of this: `interface A { x: number } interface B extends A { y: string }` — what properties does B have?',
    options: [
      'Only y: string',
      'x: number and y: string',
      'A union of x or y',
      'TypeScript error — interfaces cannot extend interfaces'
    ],
    answer: 'x: number and y: string',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'interface B extends A means B inherits all properties from A and adds its own. The resulting type B has both x: number and y: string.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types']
  },

  // ── Generics ──────────────────────────────────────────────────────────────
  {
    level: 'FUNDAMENTALS',
    topic: 'Generics',
    subtopic: 'Basic generics',
    type: 'mcq',
    prompt: 'What does this function signature mean: `function identity<T>(value: T): T`?',
    options: [
      'The function takes and returns any type, but loses type information',
      'The function is generic — it takes a value of type T and returns the same type T, preserving type information',
      'T must be an object type — primitives are not allowed',
      'The function can only be called with explicitly provided type arguments'
    ],
    answer: 'The function is generic — it takes a value of type T and returns the same type T, preserving type information',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'Generics are type parameters. TypeScript infers T from the argument, so calling identity("hello") gives return type string, not any. This preserves type safety unlike using any.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/generics.html']
  },
  {
    level: 'FUNDAMENTALS',
    topic: 'Generics',
    subtopic: 'Constraints',
    type: 'mcq',
    prompt: 'What does `<T extends { length: number }>` mean?',
    options: [
      'T must be a string or array',
      'T can be any type that has a length property of type number',
      'T cannot exceed a length of a number',
      'T extends the Number class'
    ],
    answer: 'T can be any type that has a length property of type number',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Generic constraints (extends) restrict what types T can be. `T extends { length: number }` means T must have at least a length property — it accepts strings, arrays, and any object with length.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints']
  },
  {
    level: 'ADVANCED',
    topic: 'Generics',
    subtopic: 'Conditional generics',
    type: 'mcq',
    prompt: 'What does this type produce: `type IsArray<T> = T extends any[] ? true : false`?',
    options: [
      'Always returns boolean',
      'Returns true if T is an array type, false otherwise',
      'Returns the element type of the array',
      'TypeScript error — conditional types require keyof'
    ],
    answer: 'Returns true if T is an array type, false otherwise',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Conditional types use the `T extends U ? X : Y` syntax — a ternary for types. IsArray<string[]> = true, IsArray<number> = false. They enable powerful type-level computations.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/conditional-types.html']
  },
  {
    level: 'ADVANCED',
    topic: 'Generics',
    subtopic: 'Infer keyword',
    type: 'mcq',
    prompt: 'What does `infer` do in a conditional type like `type UnpackPromise<T> = T extends Promise<infer U> ? U : T`?',
    options: [
      'Forces TypeScript to infer the type at runtime',
      'Extracts a type from within a conditional type pattern — U is inferred from the structure of T',
      'Makes the generic parameter optional',
      'Declares a new type variable scoped to the true branch'
    ],
    answer: 'Extracts a type from within a conditional type pattern — U is inferred from the structure of T',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: '`infer U` captures the resolved type of a Promise within the conditional pattern. UnpackPromise<Promise<string>> = string; UnpackPromise<number> = number. infer creates a new type variable bound in the true branch.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types']
  },

  // ── Utility Types ─────────────────────────────────────────────────────────
  {
    level: 'FUNDAMENTALS',
    topic: 'Utility Types',
    subtopic: 'Partial and Required',
    type: 'mcq',
    prompt: 'What does `Partial<User>` produce if User is `{ name: string; age: number }`?',
    options: [
      '{ name?: string; age?: number }',
      '{ name: string | undefined; age: number | undefined }',
      '{ name: string; age?: number }',
      'Removes optional properties, leaving only required ones'
    ],
    answer: '{ name?: string; age?: number }',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'Partial<T> makes all properties of T optional. It is equivalent to { [K in keyof T]?: T[K] }. Useful for update payloads or form state where not all fields are required.',
    references: ['https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype']
  },
  {
    level: 'FUNDAMENTALS',
    topic: 'Utility Types',
    subtopic: 'Pick and Omit',
    type: 'mcq',
    prompt: 'Given `type User = { id: number; name: string; password: string }`, how do you create a type with only id and name?',
    options: [
      'Pick<User, "id" | "name">',
      'Omit<User, "id" | "name">',
      'Extract<User, "id" | "name">',
      'Select<User, "id" | "name">'
    ],
    answer: 'Pick<User, "id" | "name">',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'Pick<T, Keys> constructs a type with only the specified keys. Omit<T, Keys> constructs a type with everything except the specified keys. For this case (2 props from 3), Pick is cleaner.',
    references: ['https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys']
  },
  {
    level: 'FUNDAMENTALS',
    topic: 'Utility Types',
    subtopic: 'Record',
    type: 'mcq',
    prompt: 'What does `Record<string, number>` describe?',
    options: [
      'A tuple of [string, number]',
      'An object type where all keys are strings and all values are numbers',
      'A Map with string keys and number values',
      'An array of string-number pairs'
    ],
    answer: 'An object type where all keys are strings and all values are numbers',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'Record<K, V> is equivalent to { [key in K]: V }. Record<string, number> describes an object like { a: 1, b: 2 }. Often used for dictionaries/maps with consistent value types.',
    references: ['https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type']
  },
  {
    level: 'FUNDAMENTALS',
    topic: 'Utility Types',
    subtopic: 'Readonly',
    type: 'mcq',
    prompt: 'What does `Readonly<T>` do?',
    options: [
      'Freezes the object at runtime',
      'Makes all properties read-only at the type level — TypeScript will error on assignment',
      'Removes all methods from the type, leaving only data properties',
      'Makes all properties optional'
    ],
    answer: 'Makes all properties read-only at the type level — TypeScript will error on assignment',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'Readonly<T> adds the readonly modifier to all properties. TypeScript will produce a type error if you try to reassign a property. Note: this is type-level only — Object.freeze() is needed for runtime enforcement.',
    references: ['https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype']
  },
  {
    level: 'ADVANCED',
    topic: 'Utility Types',
    subtopic: 'ReturnType and Parameters',
    type: 'mcq',
    prompt: 'What does `ReturnType<typeof fetch>` give you?',
    options: [
      'The type of the fetch function itself',
      'The return type of the fetch function — Promise<Response>',
      'The parameter types of fetch',
      'The resolved value type — Response'
    ],
    answer: 'The return type of the fetch function — Promise<Response>',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'ReturnType<T> extracts the return type of a function type. typeof fetch gives the function type; ReturnType<typeof fetch> = Promise<Response>. Pair with Awaited<> to get the resolved type.',
    references: ['https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype']
  },
  {
    level: 'ADVANCED',
    topic: 'Utility Types',
    subtopic: 'Exclude and Extract',
    type: 'mcq',
    prompt: 'Given `type Status = "active" | "inactive" | "pending"`, what is `Exclude<Status, "inactive" | "pending">`?',
    options: [
      '"inactive" | "pending"',
      '"active"',
      'Status',
      'never'
    ],
    answer: '"active"',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Exclude<T, U> removes from T all types assignable to U. Exclude<"active" | "inactive" | "pending", "inactive" | "pending"> = "active". Extract is the opposite — keeps only types assignable to U.',
    references: ['https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers']
  },
  {
    level: 'ADVANCED',
    topic: 'Utility Types',
    subtopic: 'NonNullable',
    type: 'mcq',
    prompt: 'What does `NonNullable<string | null | undefined>` produce?',
    options: [
      'string | null',
      'string',
      'string | undefined',
      'never'
    ],
    answer: 'string',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'NonNullable<T> removes null and undefined from a union type. Useful when you have received a value from a nullable source and have confirmed it is defined.',
    references: ['https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype']
  },

  // ── Union & Intersection ──────────────────────────────────────────────────
  {
    level: 'FUNDAMENTALS',
    topic: 'Type Algebra',
    subtopic: 'Union types',
    type: 'mcq',
    prompt: 'What is a union type in TypeScript?',
    options: [
      'A type that must satisfy all members simultaneously',
      'A type that can be one of several types — the value is any one of them',
      'A set of types that are combined via inheritance',
      'A type that represents the intersection of two objects'
    ],
    answer: 'A type that can be one of several types — the value is any one of them',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'A union type (A | B) means the value is either A or B. You can only use properties/methods that exist on all members of the union without narrowing.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types']
  },
  {
    level: 'FUNDAMENTALS',
    topic: 'Type Algebra',
    subtopic: 'Intersection types',
    type: 'mcq',
    prompt: 'What does `type AB = A & B` mean when A = { x: number } and B = { y: string }?',
    options: [
      'A value that is either { x: number } or { y: string }',
      'A value that has both x: number AND y: string — must satisfy both shapes',
      'An error — TypeScript does not support & on object types',
      'A value that can have x or y but not both'
    ],
    answer: 'A value that has both x: number AND y: string — must satisfy both shapes',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'Intersection types (A & B) combine multiple types — the result must satisfy all of them. For objects, A & B has all properties of A plus all properties of B.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types']
  },

  // ── Narrowing & Type Guards ───────────────────────────────────────────────
  {
    level: 'FUNDAMENTALS',
    topic: 'Type Narrowing',
    subtopic: 'typeof narrowing',
    type: 'mcq',
    prompt: 'Inside `if (typeof value === "string") { ... }`, what is the type of `value`?',
    options: [
      'string | undefined',
      'string',
      'unknown',
      'The original type of value'
    ],
    answer: 'string',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'TypeScript\'s control flow analysis narrows types based on conditions. Inside the if block, TypeScript knows value is a string and gives it that type.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards']
  },
  {
    level: 'FUNDAMENTALS',
    topic: 'Type Narrowing',
    subtopic: 'User-defined type guards',
    type: 'mcq',
    prompt: 'What is a user-defined type guard in TypeScript?',
    options: [
      'A runtime validation library integration',
      'A function that returns `value is Type` — TypeScript uses the return as a type narrowing signal',
      'A class with a protected constructor',
      'A generic constraint that checks the type at compile time'
    ],
    answer: 'A function that returns `value is Type` — TypeScript uses the return as a type narrowing signal',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'function isUser(x: unknown): x is User { return ... }. When this returns true, TypeScript narrows x to User in the calling context. The "is" predicate is the type guard return type.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates']
  },
  {
    level: 'ADVANCED',
    topic: 'Type Narrowing',
    subtopic: 'Discriminated unions',
    type: 'mcq',
    prompt: 'What makes a union a "discriminated union" that TypeScript can narrow efficiently?',
    options: [
      'Each member has at least one unique property name',
      'Each member has a shared literal-typed discriminant property (e.g., `type: "circle" | "square"`)',
      'The union has at most two members',
      'All members must be class instances'
    ],
    answer: 'Each member has a shared literal-typed discriminant property (e.g., `type: "circle" | "square"`)',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'A discriminated union has a shared property with literal values: type Shape = { kind: "circle"; radius: number } | { kind: "square"; side: number }. Checking `shape.kind === "circle"` narrows to the circle variant.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions']
  },

  // ── Advanced Types ────────────────────────────────────────────────────────
  {
    level: 'ADVANCED',
    topic: 'Advanced Types',
    subtopic: 'Mapped types',
    type: 'mcq',
    prompt: 'What does this mapped type produce: `type Optional<T> = { [K in keyof T]?: T[K] }`?',
    options: [
      'A type where all properties are required',
      'A type where all properties of T are made optional — equivalent to Partial<T>',
      'A type where all property values are union with undefined',
      'A type that only includes properties with optional values'
    ],
    answer: 'A type where all properties of T are made optional — equivalent to Partial<T>',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: '`[K in keyof T]` iterates over all keys of T. Adding ? makes each property optional. This is exactly how Partial<T> is implemented in TypeScript\'s lib.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/mapped-types.html']
  },
  {
    level: 'ADVANCED',
    topic: 'Advanced Types',
    subtopic: 'Template literal types',
    type: 'mcq',
    prompt: 'What does `type EventName = \`on${string}\`` match?',
    options: [
      'Only the string "on"',
      'Any string that starts with "on"',
      'Any string that contains "on"',
      'Only capitalized event names like "onClick"'
    ],
    answer: 'Any string that starts with "on"',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Template literal types compose string literal types. `\`on${string}\`` matches any string starting with "on" — like "onClick", "onChange", "onSubmit". The string type matches any string suffix.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html']
  },
  {
    level: 'ADVANCED',
    topic: 'Advanced Types',
    subtopic: 'Conditional types distributive',
    type: 'mcq',
    prompt: 'What is "distributive" behavior in conditional types? Given `type ToArray<T> = T extends any ? T[] : never`, what is `ToArray<string | number>`?',
    options: [
      '(string | number)[]',
      'string[] | number[]',
      'never',
      'TypeScript error'
    ],
    answer: 'string[] | number[]',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'When a conditional type receives a union, TypeScript distributes it: ToArray<string | number> = ToArray<string> | ToArray<number> = string[] | number[]. To prevent distribution, wrap in []: `[T] extends [any] ? T[] : never`.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types']
  },
  {
    level: 'ADVANCED',
    topic: 'Advanced Types',
    subtopic: 'Recursive types',
    type: 'mcq',
    prompt: 'How would you type a deeply nested JSON value in TypeScript?',
    options: [
      'type JSON = string | number | boolean | null | object',
      'type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue }',
      'type JSON = Record<string, unknown>',
      'Recursive types are not supported in TypeScript'
    ],
    answer: 'type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue }',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'TypeScript supports recursive type aliases (since TS 3.7 with lazy evaluation). JSONValue references itself in array and object positions, correctly typing arbitrarily nested JSON structures.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/objects.html#the-readonly-modifier']
  },

  // ── TypeScript + React ────────────────────────────────────────────────────
  {
    level: 'FUNDAMENTALS',
    topic: 'TypeScript + React',
    subtopic: 'FC type',
    type: 'mcq',
    prompt: 'Should you use `React.FC<Props>` to type function components in modern React TypeScript?',
    options: [
      'Yes — it is the official recommended way',
      'No — it is increasingly discouraged; prefer directly typing props and return type',
      'Only for class components',
      'Only when the component accepts children'
    ],
    answer: 'No — it is increasingly discouraged; prefer directly typing props and return type',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'React.FC adds implicit children prop (before React 18), wraps return type in ReactElement, and was removed from Create React App defaults. Prefer: `function Component(props: Props): JSX.Element` for clarity.',
    references: ['https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components']
  },
  {
    level: 'FUNDAMENTALS',
    topic: 'TypeScript + React',
    subtopic: 'useState with types',
    type: 'mcq',
    prompt: 'How do you type `useState` when the initial value is null but will later be a User object?',
    options: [
      'const [user, setUser] = useState(null)',
      'const [user, setUser] = useState<User | null>(null)',
      'const [user, setUser] = useState<User>(null)',
      'const [user, setUser] = useState<User>({})'
    ],
    answer: 'const [user, setUser] = useState<User | null>(null)',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'Provide the generic type argument explicitly when TypeScript cannot infer from the initial value. `useState<User | null>(null)` tells TypeScript this state holds User | null, so setUser(fetchedUser) is type-safe.',
    references: ['https://react.dev/learn/typescript#typing-usestate']
  },
  {
    level: 'ADVANCED',
    topic: 'TypeScript + React',
    subtopic: 'Discriminated union state',
    type: 'mcq',
    prompt: 'How should you type an async data loading state in TypeScript for maximum type safety?',
    options: [
      'const [data, setData] = useState(null); const [loading, setLoading] = useState(false); const [error, setError] = useState(null)',
      'type State = { status: "idle" } | { status: "loading" } | { status: "success"; data: User } | { status: "error"; error: Error }; const [state, setState] = useState<State>({ status: "idle" })',
      'const [state, setState] = useState<{ data?: User; loading: boolean; error?: Error }>({ loading: false })',
      'interface AsyncState<T> { data: T | null; loading: boolean; error: string | null }'
    ],
    answer: 'type State = { status: "idle" } | { status: "loading" } | { status: "success"; data: User } | { status: "error"; error: Error }; const [state, setState] = useState<State>({ status: "idle" })',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'The discriminated union approach makes invalid states impossible — you cannot have data and error simultaneously. TypeScript narrows automatically in switch/if statements, giving full type safety in each branch.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions']
  },
  {
    level: 'ADVANCED',
    topic: 'TypeScript + React',
    subtopic: 'Event handlers',
    type: 'mcq',
    prompt: 'What is the correct type for a React `onKeyDown` handler prop?',
    options: [
      'React.KeyDownHandler',
      'React.KeyboardEventHandler<HTMLInputElement>',
      '(e: KeyboardEvent) => void',
      'EventHandler<KeyboardEvent>'
    ],
    answer: 'React.KeyboardEventHandler<HTMLInputElement>',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'React provides typed event handler aliases: React.KeyboardEventHandler<T> = (event: React.KeyboardEvent<T>) => void. These are for the handler function type. Use React.KeyboardEvent<T> for the event parameter type.',
    references: ['https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/']
  },
  {
    level: 'ADVANCED',
    topic: 'TypeScript + React',
    subtopic: 'useReducer typing',
    type: 'mcq',
    prompt: 'What is the benefit of typing a useReducer action as a discriminated union?',
    options: [
      'It makes the reducer run faster',
      'TypeScript narrows the action type in each case branch, so action.payload is typed correctly per action',
      'It enables the reducer to handle async actions',
      'It allows multiple reducers to handle the same action'
    ],
    answer: 'TypeScript narrows the action type in each case branch, so action.payload is typed correctly per action',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'type Action = { type: "increment" } | { type: "setName"; payload: string }. In `case "setName"`, TypeScript knows action.payload is string. Without discriminated unions, payload would be unknown and require casting.',
    references: ['https://react.dev/learn/typescript#typing-usereducer']
  },
  {
    level: 'ADVANCED',
    topic: 'TypeScript + React',
    subtopic: 'Context typing',
    type: 'mcq',
    prompt: 'What is the type-safe way to create a context that cannot be undefined at the consumer?',
    options: [
      'const Ctx = createContext(null)',
      'Create a custom hook that wraps useContext and throws if the value is undefined: `if (!ctx) throw new Error("Must be inside Provider")`',
      'Use createContext<T>() with no default value',
      'Type the context as Readonly<T>'
    ],
    answer: 'Create a custom hook that wraps useContext and throws if the value is undefined: `if (!ctx) throw new Error("Must be inside Provider")`',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'The pattern: `const Ctx = createContext<UserContextType | undefined>(undefined)`. Then `function useUserContext() { const ctx = useContext(Ctx); if (!ctx) throw Error("Missing Provider"); return ctx; }`. Consumers get UserContextType — not | undefined.',
    references: ['https://kentcdodds.com/blog/how-to-use-react-context-effectively']
  },

  // ── Configuration ─────────────────────────────────────────────────────────
  {
    level: 'FUNDAMENTALS',
    topic: 'tsconfig',
    subtopic: 'Strict mode',
    type: 'mcq',
    prompt: 'What does `"strict": true` in tsconfig.json enable?',
    options: [
      'Only strict null checks',
      'A bundle of strict checks: strictNullChecks, noImplicitAny, strictFunctionTypes, strictBindCallApply, and more',
      'Runtime type checking',
      'Prevents the use of any type'
    ],
    answer: 'A bundle of strict checks: strictNullChecks, noImplicitAny, strictFunctionTypes, strictBindCallApply, and more',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: '"strict" is a shorthand for enabling a group of strict type checking options. The most important are strictNullChecks (null/undefined are not assignable to other types) and noImplicitAny (variables must have explicit types).',
    references: ['https://www.typescriptlang.org/tsconfig/#strict']
  },
  {
    level: 'FUNDAMENTALS',
    topic: 'tsconfig',
    subtopic: 'Module resolution',
    type: 'mcq',
    prompt: 'What does the `paths` option in tsconfig.json do?',
    options: [
      'Specifies which files TypeScript should compile',
      'Maps import paths to file system locations — enables path aliases like `@/components`',
      'Configures the output directory for compiled files',
      'Sets the module resolution algorithm (node vs bundler)'
    ],
    answer: 'Maps import paths to file system locations — enables path aliases like `@/components`',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'paths maps virtual import paths to real ones: `"@/*": ["./src/*"]`. TypeScript uses this for type checking; bundlers (Vite, webpack) need separate alias configuration to resolve at runtime.',
    references: ['https://www.typescriptlang.org/tsconfig/#paths']
  },

  // ── Declaration files ─────────────────────────────────────────────────────
  {
    level: 'ADVANCED',
    topic: 'Declaration Files',
    subtopic: 'Module augmentation',
    type: 'mcq',
    prompt: 'How do you extend an existing library\'s types in TypeScript without modifying the library?',
    options: [
      'Copy the library\'s type file and add your properties',
      'Use module augmentation — declare the same module in a .d.ts file and add properties to the interface',
      'Use type casting wherever you need the additional properties',
      'TypeScript does not allow extending library types'
    ],
    answer: 'Use module augmentation — declare the same module in a .d.ts file and add properties to the interface',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Module augmentation uses declaration merging: `declare module "express" { interface Request { user?: User } }`. TypeScript merges this with the library\'s existing declarations, adding your custom property globally.',
    references: ['https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation']
  },
  {
    level: 'ADVANCED',
    topic: 'Declaration Files',
    subtopic: 'DefinitelyTyped',
    type: 'mcq',
    prompt: 'What is `@types/*` and when do you need it?',
    options: [
      'TypeScript\'s built-in type definitions for the web platform',
      'Community-maintained type definitions (DefinitelyTyped) for JavaScript libraries that don\'t ship their own types',
      'Custom type definition files generated during build',
      'ESLint type checking plugins'
    ],
    answer: 'Community-maintained type definitions (DefinitelyTyped) for JavaScript libraries that don\'t ship their own types',
    difficulty: 'easy',
    estimatedTime: 30,
    explanation: 'When a library doesn\'t include TypeScript types, the community publishes them to @types/* on npm (from the DefinitelyTyped repository). Install `@types/lodash` to get type definitions for the `lodash` library.',
    references: ['https://www.typescriptlang.org/docs/handbook/2/type-declarations.html#definitelytyped--types']
  },

  // ── Enums ─────────────────────────────────────────────────────────────────
  {
    level: 'FUNDAMENTALS',
    topic: 'Enums',
    subtopic: 'const enum vs enum',
    type: 'mcq',
    prompt: 'What is the difference between `enum` and `const enum` in TypeScript?',
    options: [
      'const enum has constant default values; enum values are dynamic',
      'const enum is inlined at compile time (no runtime object generated); enum generates a JavaScript object at runtime',
      'enum can be used in conditional types; const enum cannot',
      'They are identical'
    ],
    answer: 'const enum is inlined at compile time (no runtime object generated); enum generates a JavaScript object at runtime',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: 'Regular enums compile to a JavaScript object (reversal mapping included). const enums are completely erased and their values are inlined at every usage. const enums reduce bundle size but have limitations with isolated modules.',
    references: ['https://www.typescriptlang.org/docs/handbook/enums.html#const-enums']
  },
  {
    level: 'ADVANCED',
    topic: 'Enums',
    subtopic: 'Union vs enum',
    type: 'mcq',
    prompt: 'When should you prefer a string union type over an enum?',
    options: [
      'Always — enums are obsolete in modern TypeScript',
      'When you do not need runtime iteration over values and want simpler, idiomatic TypeScript without a compiled object',
      'When you need the reverse mapping (value to name)',
      'When the values are numeric'
    ],
    answer: 'When you do not need runtime iteration over values and want simpler, idiomatic TypeScript without a compiled object',
    difficulty: 'medium',
    estimatedTime: 60,
    explanation: '`type Direction = "north" | "south" | "east" | "west"` is simpler, tree-shakeable, and does not generate any runtime code. Use enums when you need Object.values(Enum) iteration or numeric bitfield operations.',
    references: ['https://www.typescriptlang.org/docs/handbook/enums.html']
  },

  // ── Decorators ────────────────────────────────────────────────────────────
  {
    level: 'ADVANCED',
    topic: 'Decorators',
    subtopic: 'TypeScript decorators',
    type: 'mcq',
    prompt: 'TypeScript decorators are primarily used for:',
    options: [
      'Adding runtime type information to classes and methods',
      'Metaprogramming — annotating or modifying classes, methods, and properties at design time (commonly in NestJS, Angular)',
      'Replacing generics for cleaner syntax',
      'Providing type guards for complex types'
    ],
    answer: 'Metaprogramming — annotating or modifying classes, methods, and properties at design time (commonly in NestJS, Angular)',
    difficulty: 'hard',
    estimatedTime: 90,
    explanation: 'Decorators (@Component, @Injectable, @Get) are a metaprogramming syntax for annotating and modifying class declarations and members. They are stage 3 in TC39 and widely used in Angular and NestJS.',
    references: ['https://www.typescriptlang.org/docs/handbook/decorators.html']
  }
]
