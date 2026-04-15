#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

function installDependencies() {
  console.log('🚀 Installing dependencies for all challenge projects...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const challengePath of CHALLENGE_DIRECTORIES) {
    const fullPath = join(__dirname, '..', challengePath);
    const packageJsonPath = join(fullPath, 'package.json');

    if (!existsSync(packageJsonPath)) {
      console.log(`⚠️  Skipping ${challengePath} - no package.json found`);
      continue;
    }

    try {
      console.log(`📦 Installing dependencies for ${challengePath}...`);
      execSync('npm install', { 
        cwd: fullPath, 
        stdio: 'pipe'
      });
      console.log(`✅ Successfully installed dependencies for ${challengePath}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to install dependencies for ${challengePath}:`, error.message);
      errorCount++;
    }
  }

  // Install test-machine dependencies if they exist
  const testMachineFrontend = join(__dirname, '..', 'test-machine', 'frontend');
  const testMachineBackend = join(__dirname, '..', 'test-machine', 'backend');

  if (existsSync(join(testMachineFrontend, 'package.json'))) {
    try {
      console.log('📦 Installing test-machine frontend dependencies...');
      execSync('npm install', { cwd: testMachineFrontend, stdio: 'pipe' });
      console.log('✅ Test-machine frontend dependencies installed');
      successCount++;
    } catch (error) {
      console.error('❌ Failed to install test-machine frontend dependencies:', error.message);
      errorCount++;
    }
  }

  if (existsSync(join(testMachineBackend, 'package.json'))) {
    try {
      console.log('📦 Installing test-machine backend dependencies...');
      execSync('npm install', { cwd: testMachineBackend, stdio: 'pipe' });
      console.log('✅ Test-machine backend dependencies installed');
      successCount++;
    } catch (error) {
      console.error('❌ Failed to install test-machine backend dependencies:', error.message);
      errorCount++;
    }
  }

  console.log(`\n🎉 Installation complete!`);
  console.log(`✅ Success: ${successCount} projects`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} projects`);
  }
}

// Run if called directly
if (import.meta.url === `file://${import.meta.resolve('./install-all.js')}`){
  installDependencies();
}

export { installDependencies };