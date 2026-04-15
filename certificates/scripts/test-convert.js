import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CHALLENGE_DIRECTORIES = [
  // Test with just first few challenges
  'mid/01-hooks/challenges/01-useState-form',
  'mid/01-hooks/challenges/02-useEffect-data-fetching',
  'mid/01-hooks/challenges/03-useRef-focus'
];

function parseChallengePath(challengePath) {
  const [level, moduleNum, , challengeNum] = challengePath.split('/');
  const challengeName = challengePath.split('/').pop() || '';
  
  return {
    path: challengePath,
    name: `${level}-${challengeName}`,
    title: formatTitle(challengeName),
    level: level,
    module: moduleNum,
    challenge: challengeNum
  };
}

function formatTitle(challengeName) {
  return challengeName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/([A-Z])/g, ' $1')
    .trim();
}

function loadTemplate(templateName) {
  const templatePath = join(__dirname, '..', 'shared', templateName);
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  return readFileSync(templatePath, 'utf-8');
}

function processTemplate(template, variables) {
  let processed = template;
  for (const [key, value] of Object.entries(variables)) {
    processed = processed.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return processed;
}

function setupProject(projectInfo) {
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

  try {
    // Process and write package.json
    const packageTemplate = loadTemplate('package.template.json');
    const packageJson = processTemplate(packageTemplate, variables);
    writeFileSync(join(challengeDir, 'package.json'), packageJson);

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
  } catch (error) {
    console.error(`❌ Error setting up ${projectInfo.name}:`, error.message);
  }
}

// Main execution
function main() {
  console.log('🚀 Starting certificate challenges conversion...\n');

  // Process test challenges
  for (const challengePath of CHALLENGE_DIRECTORIES) {
    try {
      const projectInfo = parseChallengePath(challengePath);
      setupProject(projectInfo);
    } catch (error) {
      console.error(`❌ Error processing ${challengePath}:`, error.message);
    }
  }

  console.log('🎉 Test conversion completed successfully!');
  console.log('\n💡 Next steps:');
  console.log('1. Test one of the converted projects');
  console.log('2. If successful, run the full conversion');
}

main();