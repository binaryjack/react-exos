#!/usr/bin/env node
import { mkdirSync } from 'fs';
import { join } from 'path';

const BASE_DIR = 'd:\\Sources\\react-exos\\certificates\\test-machine';

const FRONTEND_DIRS = [
  'frontend/src/features/testing/components/TestPlayer',
  'frontend/src/features/testing/components/QuestionTypes',
  'frontend/src/features/testing/components/Timer',
  'frontend/src/features/testing/store/commands',
  'frontend/src/features/testing/store/queries',
  'frontend/src/features/testing/api',
  
  'frontend/src/features/admin/components/AdminPanel',
  'frontend/src/features/admin/components/TestManagement',
  'frontend/src/features/admin/components/QuestionManagement',
  'frontend/src/features/admin/components/QuestionTypes',
  'frontend/src/features/admin/components/ImportExport',
  'frontend/src/features/admin/components/Analytics',
  'frontend/src/features/admin/store/commands',
  'frontend/src/features/admin/store/queries',
  'frontend/src/features/admin/api',
  
  'frontend/src/features/analytics/components/ResultsDashboard',
  'frontend/src/features/analytics/components/PerformanceCharts',
  'frontend/src/features/analytics/components/ProgressTracking',
  'frontend/src/features/analytics/store',
  'frontend/src/features/analytics/api',
  
  'frontend/src/shared/components/Layout',
  'frontend/src/shared/components/Forms',
  'frontend/src/shared/components/RichEditor',
  'frontend/src/shared/components/DataTable',
  'frontend/src/shared/components/CodeEditor',
  'frontend/src/shared/components/DragDrop',
  'frontend/src/shared/components/UI',
  'frontend/src/shared/hooks',
  'frontend/src/shared/utils',
  'frontend/src/shared/types',
  
  'frontend/src/store/middleware',
  'frontend/public'
];

const BACKEND_DIRS = [
  'backend/src/domain/testing/commands/handlers',
  'backend/src/domain/testing/queries/handlers',
  'backend/src/domain/testing/events/handlers',
  'backend/src/domain/testing/aggregates',
  'backend/src/domain/testing/valueObjects',
  
  'backend/src/domain/test-management/commands/handlers',
  'backend/src/domain/test-management/queries/handlers',
  'backend/src/domain/test-management/aggregates',
  
  'backend/src/domain/analytics/queries/handlers',
  'backend/src/domain/analytics/projections',
  
  'backend/src/infrastructure/cqrs/interfaces',
  'backend/src/infrastructure/database/write',
  'backend/src/infrastructure/database/read',
  'backend/src/infrastructure/database/migrations',
  'backend/src/infrastructure/database/seeders',
  'backend/src/infrastructure/websocket/events',
  'backend/src/infrastructure/eventStore',
  
  'backend/src/application/services',
  'backend/src/application/processors',
  'backend/src/application/validators',
  
  'backend/src/api/routes/commands',
  'backend/src/api/routes/queries',
  'backend/src/api/routes/websocket',
  'backend/src/api/controllers',
  'backend/src/api/middleware',
  'backend/src/api/dto/commands',
  'backend/src/api/dto/queries',
  'backend/src/api/dto/responses',
  
  'backend/src/config'
];

function createDirectories() {
  console.log('🚀 Creating test-machine directory structure...\n');

  // Create frontend directories
  console.log('📁 Creating frontend directories...');
  for (const dir of FRONTEND_DIRS) {
    const fullPath = join(BASE_DIR, dir);
    try {
      mkdirSync(fullPath, { recursive: true });
      console.log(`✓ ${dir}`);
    } catch (error) {
      console.error(`❌ Failed to create ${dir}:`, error.message);
    }
  }

  // Create backend directories  
  console.log('\n📁 Creating backend directories...');
  for (const dir of BACKEND_DIRS) {
    const fullPath = join(BASE_DIR, dir);
    try {
      mkdirSync(fullPath, { recursive: true });
      console.log(`✓ ${dir}`);
    } catch (error) {
      console.error(`❌ Failed to create ${dir}:`, error.message);
    }
  }

  console.log('\n🎉 Test-machine directory structure created successfully!');
}

createDirectories();