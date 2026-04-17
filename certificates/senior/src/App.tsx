const topics = [
  { path: '/01-react-19-actions/README.md', name: '01 - React 19 Actions' },
  { path: '/02-concurrent-features/README.md', name: '02 - Concurrent Features' },
  { path: '/03-server-components/README.md', name: '03 - Server Components' },
  { path: '/04-react-compiler/README.md', name: '04 - React Compiler' },
  { path: '/05-advanced-patterns/README.md', name: '05 - Advanced Patterns' },
  { path: '/06-accessibility/README.md', name: '06 - Accessibility' },
  { path: '/07-testing/README.md', name: '07 - Testing' },
  { path: '/08-refs-and-errors/README.md', name: '08 - Refs (Advanced) & Error Boundary Reset' },
];

export default function App() {
  return (
    <main className="container">
      <h1>React Certificates - SENIOR</h1>
      <p>This is an independent React project for your SENIOR exam preparation.</p>
      <p>Open each topic README to work through learnings and coding challenges.</p>

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
          <li>Start from `Challenge.tsx` in each challenge folder.</li>
          <li>Use `Solution.tsx` or `Solution.test.tsx` after attempting.</li>
        </ol>
      </section>
    </main>
  );
}
