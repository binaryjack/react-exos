const topics = [
  { path: '/01-hooks/README.md', name: '01 - Hooks' },
  { path: '/02-component-patterns/README.md', name: '02 - Component Patterns' },
  { path: '/03-performance/README.md', name: '03 - Performance' },
  { path: '/04-error-handling/README.md', name: '04 - Error Handling' },
  { path: '/05-forms/README.md', name: '05 - Forms' },
  { path: '/06-context-state/README.md', name: '06 - Context and State' },
];

export default function App() {
  return (
    <main className="container">
      <h1>React Certificates - MID</h1>
      <p>This is an independent React project for your MID exam preparation.</p>
      <p>Open each topic README to work through learnings and challenges.</p>

      <section>
        <h2>Topics</h2>
        <ul>
          {topics.map((topic) => (
            <li key={topic.path}>
              <a href={topic.path} target="_blank" rel="noreferrer">
                {topic.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>How to use</h2>
        <ol>
          <li>Pick a topic README.</li>
          <li>Open a challenge folder and start from `Challenge.tsx`.</li>
          <li>Check `Solution.tsx` only after attempting.</li>
        </ol>
      </section>
    </main>
  );
}
