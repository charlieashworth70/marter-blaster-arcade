#!/usr/bin/env node

/**
 * MerterBlaster Setup Verification Script
 * Checks that all required files and configurations are in place
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'index.html',
  'game.js',
  'style.css',
  'manifest.json',
  'service-worker.js',
  'package.json',
  'README.md',
  'LICENSE',
  '.gitignore',
  '.eslintrc.json',
  '.prettierrc',
  'jest.config.js',
  'tests/setup.js',
  'tests/game.test.js',
  '.github/workflows/deploy.yml',
  '.github/workflows/test.yml',
  '.github/ISSUE_TEMPLATE/bug_report.md',
  '.github/ISSUE_TEMPLATE/feature_request.md',
  '.github/PULL_REQUEST_TEMPLATE.md',
  'docs/ARCHITECTURE.md',
  'docs/DEVELOPMENT.md',
  'scripts/setup-github.sh'
];

const REQUIRED_PACKAGE_JSON_FIELDS = [
  'name',
  'version',
  'description',
  'scripts.start',
  'scripts.test',
  'scripts.lint',
  'devDependencies.eslint',
  'devDependencies.jest',
  'devDependencies.prettier'
];

console.log('🔍 Verifying MerterBlaster Setup...\n');

let allPassed = true;
const results = [];

// Check required files
console.log('📁 Checking required files:');
REQUIRED_FILES.forEach(file => {
  const exists = fs.existsSync(file);
  const status = exists ? '✅' : '❌';
  results.push({ file, exists });
  console.log(`  ${status} ${file}`);
  
  if (!exists) {
    allPassed = false;
  }
});

// Check package.json
console.log('\n📦 Checking package.json:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  REQUIRED_PACKAGE_JSON_FIELDS.forEach(field => {
    const parts = field.split('.');
    let value = packageJson;
    let exists = true;
    
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        exists = false;
        break;
      }
    }
    
    const status = exists ? '✅' : '❌';
    console.log(`  ${status} ${field}`);
    
    if (!exists) {
      allPassed = false;
    }
  });
  
  // Check scripts
  console.log('\n🔄 Available npm scripts:');
  Object.keys(packageJson.scripts || {}).forEach(script => {
    console.log(`  📝 npm run ${script}`);
  });
  
} catch (error) {
  console.log(`  ❌ Error reading package.json: ${error.message}`);
  allPassed = false;
}

// Check GitHub Actions workflows
console.log('\n⚡ Checking GitHub Actions:');
const workflowsDir = '.github/workflows';
if (fs.existsSync(workflowsDir)) {
  const workflows = fs.readdirSync(workflowsDir);
  workflows.forEach(workflow => {
    console.log(`  ✅ ${workflow}`);
  });
} else {
  console.log('  ❌ No workflows directory found');
  allPassed = false;
}

// Check test setup
console.log('\n🧪 Checking test setup:');
if (fs.existsSync('tests/game.test.js')) {
  const testContent = fs.readFileSync('tests/game.test.js', 'utf8');
  const hasTests = testContent.includes('describe(') || testContent.includes('test(');
  console.log(`  ${hasTests ? '✅' : '❌'} Test file contains test cases`);
  
  if (!hasTests) {
    allPassed = false;
  }
} else {
  console.log('  ❌ Test file not found');
  allPassed = false;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log(allPassed ? '🎉 SETUP VERIFICATION PASSED!' : '⚠️  SETUP VERIFICATION FAILED');
console.log('='.repeat(50));

if (allPassed) {
  console.log('\n✅ All required files and configurations are in place.');
  console.log('\n🚀 Next steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm test');
  console.log('3. Run: npm start');
  console.log('4. Push to GitHub and enable Pages');
  console.log('\n🎮 Happy game development!');
} else {
  console.log('\n❌ Some required files or configurations are missing.');
  console.log('Please check the missing items above and add them.');
  
  const missingFiles = results.filter(r => !r.exists).map(r => r.file);
  if (missingFiles.length > 0) {
    console.log('\nMissing files:');
    missingFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
  }
}

process.exit(allPassed ? 0 : 1);