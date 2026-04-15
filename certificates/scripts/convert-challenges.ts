#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ProjectInfo {
  path: string;
  name: string;
  title: string;
  level: 'mid' | 'senior';
  module: string;
  challenge: string;
}

const CHALLENGE_DIRECTORIES = [
  // Mid-level challenges
  'mid/01-hooks/challenges/01-useState-form',
  'mid/01-hooks/challenges/02-useEffect-data-fetching',
  'mid/01-hooks/challenges/03-useRef-focus',
  'mid/01-hooks/challenges/04-useReducer-cart',
  'mid/01-hooks/challenges/05-useContext-theme',
  'mid/01-hooks/challenges/06-useMemo-useCallback',
  'mid/01-hooks/challenges/07-custom-hooks',
  'mid/02-component-patterns/challenges/01-compound-components',
  'mid/02-component-patterns/challenges/02-render-props',
  'mid/03-performance/challenges/01-memo-optimization',
  'mid/03-performance/challenges/02-lazy-loading',
  'mid/04-error-handling/challenges/01-error-boundary',
  'mid/05-forms/challenges/01-controlled-form',
  'mid/06-context-state/challenges/01-auth-context',
  
  // Senior-level challenges
  'senior/01-react-19-actions/challenges/01-useActionState',
  'senior/01-react-19-actions/challenges/02-useOptimistic',
  'senior/01-react-19-actions/challenges/03-use-api',
  'senior/02-concurrent-features/challenges/01-useTransition',
  'senior/02-concurrent-features/challenges/02-useDeferredValue',
  'senior/02-concurrent-features/challenges/03-suspense-parallel',
  'senior/04-react-compiler/challenges/01-auto-memoization',
  'senior/05-advanced-patterns/challenges/01-compound-tabs',
  'senior/05-advanced-patterns/challenges/02-generic-table',
  'senior/06-accessibility/challenges/01-accessible-modal',
  'senior/07-testing/challenges/01-test-counter-hook',
  'senior/07-testing/challenges/02-test-async-component'
];

const TESTING_CHALLENGES = [
  'senior/07-testing/challenges/01-test-counter-hook',
  'senior/07-testing/challenges/02-test-async-component'
];

function parseChallengePath(challengePath: string): ProjectInfo {
  const [level, moduleNum, , challengeNum] = challengePath.split('/');
  const challengeName = challengePath.split('/').pop() || '';
  
  return {
    path: challengePath,
    name: `${level}-${challengeName}`,
    title: formatTitle(challengeName),
    level: level as 'mid' | 'senior',
    module: moduleNum,
    challenge: challengeNum
  };
}

function formatTitle(challengeName: string): string {
  return challengeName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/([A-Z])/g, ' $1')
    .trim();
}

function loadTemplate(templateName: string): string {
  const templatePath = join(__dirname, '..', 'shared', templateName);
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  return readFileSync(templatePath, 'utf-8');
}

function processTemplate(template: string, variables: Record<string, string>): string {
  let processed = template;
  for (const [key, value] of Object.entries(variables)) {
    processed = processed.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return processed;
}

function setupProject(projectInfo: ProjectInfo): void {
  const certificatesDir = join(__dirname, '..');
  const challengeDir = join(certificatesDir, projectInfo.path);
  const srcDir = join(challengeDir, 'src');

  console.log(`Setting up project: ${projectInfo.name}`);

  // Create directories
  if (!existsSync(challengeDir)) {
    mkdirSync(challengeDir, { recursive: true });
  }
  if (!existsSync(srcDir)) {
    mkdirSync(srcDir, { recursive: true });
  }

  // Template variables
  const variables = {
    PROJECT_NAME: projectInfo.name,
    PROJECT_TITLE: projectInfo.title
  };

  // Process and write package.json
  const packageTemplate = loadTemplate('package.template.json');
  const packageJson = processTemplate(packageTemplate, variables);
  
  // Add testing dependencies if needed
  if (TESTING_CHALLENGES.includes(projectInfo.path)) {
    const packageData = JSON.parse(packageJson);
    packageData.devDependencies['@testing-library/react'] = '^16.0.0';
    packageData.devDependencies['@testing-library/jest-dom'] = '^6.0.0';
    packageData.devDependencies['@testing-library/user-event'] = '^14.0.0';
    packageData.devDependencies['jsdom'] = '^25.0.0';
    packageData.devDependencies['vitest'] = '^2.0.0';
    packageData.scripts.test = 'vitest';
    writeFileSync(join(challengeDir, 'package.json'), JSON.stringify(packageData, null, 2));
  } else {
    writeFileSync(join(challengeDir, 'package.json'), packageJson);
  }

  // Copy other template files
  const templates = [
    { src: 'vite.config.template.ts', dest: 'vite.config.ts' },
    { src: 'tsconfig.template.json', dest: 'tsconfig.json' },
    { src: 'eslint.config.template.js', dest: 'eslint.config.js' }
  ];

  for (const template of templates) {
    const templateContent = loadTemplate(template.src);
    const processedContent = processTemplate(templateContent, variables);
    writeFileSync(join(challengeDir, template.dest), processedContent);
  }

  // Process and write index.html
  const indexTemplate = loadTemplate('index.template.html');
  const indexHtml = processTemplate(indexTemplate, variables);
  writeFileSync(join(challengeDir, 'index.html'), indexHtml);

  // Copy main.tsx to src/
  const mainTemplate = loadTemplate('main.template.tsx');
  writeFileSync(join(srcDir, 'main.tsx'), mainTemplate);

  // Convert Challenge.tsx to App.tsx if it exists
  const challengePath = join(challengeDir, 'Challenge.tsx');
  const appPath = join(srcDir, 'App.tsx');
  
  if (existsSync(challengePath)) {
    const challengeContent = readFileSync(challengePath, 'utf-8');
    writeFileSync(appPath, challengeContent);
    console.log(`✓ Converted Challenge.tsx → src/App.tsx`);
  } else {
    // Create a placeholder App.tsx
    const placeholderApp = `import React from 'react';

export default function App() {
  return (
    <div className="challenge-container">
      <h1 className="challenge-title">${projectInfo.title}</h1>
      <div className="alert alert-info">
        This challenge is ready for implementation. Check the original Challenge.tsx file for instructions.
      </div>
    </div>
  );
}`;
    writeFileSync(appPath, placeholderApp);
    console.log(`✓ Created placeholder src/App.tsx`);
  }

  // Copy Solution.tsx to src/ for reference
  const solutionPath = join(challengeDir, 'Solution.tsx');
  const solutionDestPath = join(srcDir, 'Solution.tsx');
  
  if (existsSync(solutionPath)) {
    copyFileSync(solutionPath, solutionDestPath);
    console.log(`✓ Copied Solution.tsx → src/Solution.tsx`);
  }

  console.log(`✅ Project ${projectInfo.name} setup complete\n`);
}

function generateStartScripts(): string[] {
  const scripts = [];
  
  for (const challengePath of CHALLENGE_DIRECTORIES) {
    const projectInfo = parseChallengePath(challengePath);
    const scriptName = `start:${projectInfo.name}`;
    const scriptCommand = `cd "${projectInfo.path}" && npm run dev`;
    scripts.push(`    "${scriptName}": "${scriptCommand}"`);
  }
  
  return scripts;
}

// Main execution
function main() {
  console.log('🚀 Starting certificate challenges conversion...\n');

  // Process all challenges
  for (const challengePath of CHALLENGE_DIRECTORIES) {
    try {
      const projectInfo = parseChallengePath(challengePath);
      setupProject(projectInfo);
    } catch (error) {
      console.error(`❌ Error processing ${challengePath}:`, error.message);
    }
  }

  // Generate start scripts for reference
  console.log('📋 Generated start scripts for root package.json:');
  console.log('{\n  "scripts": {');
  console.log(generateStartScripts().join(',\n'));
  console.log('  }\n}');

  console.log('🎉 All challenges converted successfully!');
  console.log('\n💡 Next steps:');
  console.log('1. Update the root package.json with the generated scripts');
  console.log('2. Run "pnpm install" in each challenge directory');
  console.log('3. Test a few challenges with "npm run dev"');
}

// Run if called directly
if (import.meta.url === `file://${__filename}`) {
  main();
}

export { setupProject, parseChallengePath, CHALLENGE_DIRECTORIES };