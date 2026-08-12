#!/usr/bin/env node

/**
 * Setup Verification Script
 * Checks that the environment is properly configured before running the application
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function error(message) {
  log(`✗ ${message}`, 'red');
}

function warning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ ${message}`, 'blue');
}

async function checkNodeVersion() {
  const version = process.version;
  const major = parseInt(version.slice(1).split('.')[0]);
  
  if (major >= 18) {
    success(`Node.js version ${version} (meets minimum requirement)`);
    return true;
  } else {
    error(`Node.js version ${version} (requires 18 or higher)`);
    return false;
  }
}

function checkEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    error('.env file not found');
    info('Create .env file: cp .env.example .env');
    return false;
  }
  
  success('.env file exists');
  return true;
}

function checkEnvVariables() {
  dotenv.config();
  
  const required = [
    'COGNODB_URI',
    'COGNODB_USER',
    'COGNODB_PASSWORD'
  ];
  
  let allPresent = true;
  
  for (const variable of required) {
    if (process.env[variable]) {
      success(`${variable} is set`);
    } else {
      error(`${variable} is missing`);
      allPresent = false;
    }
  }
  
  // Check URI format
  if (process.env.COGNODB_URI) {
    if (process.env.COGNODB_URI.startsWith('bolt+s://')) {
      success('COGNODB_URI uses secure bolt+s:// protocol');
    } else if (process.env.COGNODB_URI.startsWith('bolt://')) {
      warning('COGNODB_URI uses bolt:// (consider using bolt+s:// for security)');
    } else {
      error('COGNODB_URI should start with bolt+s:// or bolt://');
      allPresent = false;
    }
  }
  
  return allPresent;
}

function checkDependencies() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
  
  if (!fs.existsSync(nodeModulesPath)) {
    error('node_modules not found');
    info('Run: npm install');
    return false;
  }
  
  success('Dependencies installed');
  return true;
}

function checkProjectStructure() {
  const requiredPaths = [
    'server/db.js',
    'server/routes.js',
    'server/server.js',
    'scripts/seed.js',
    'src/App.jsx',
    'src/main.jsx',
    'index.html',
    'vite.config.js'
  ];
  
  let allPresent = true;
  
  for (const filePath of requiredPaths) {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
      success(`${filePath} exists`);
    } else {
      error(`${filePath} missing`);
      allPresent = false;
    }
  }
  
  return allPresent;
}

function checkGitignore() {
  const gitignorePath = path.join(__dirname, '..', '.gitignore');
  
  if (!fs.existsSync(gitignorePath)) {
    warning('.gitignore not found');
    return false;
  }
  
  const content = fs.readFileSync(gitignorePath, 'utf-8');
  
  const required = ['.env', 'node_modules'];
  let allPresent = true;
  
  for (const item of required) {
    if (content.includes(item)) {
      success(`.gitignore includes ${item}`);
    } else {
      error(`.gitignore missing ${item}`);
      allPresent = false;
    }
  }
  
  return allPresent;
}

async function testDatabaseConnection() {
  try {
    dotenv.config();
    
    const neo4j = await import('neo4j-driver');
    const driver = neo4j.default.driver(
      process.env.COGNODB_URI,
      neo4j.default.auth.basic(
        process.env.COGNODB_USER,
        process.env.COGNODB_PASSWORD
      )
    );
    
    const session = driver.session();
    await session.run('RETURN 1');
    await session.close();
    await driver.close();
    
    success('Database connection successful');
    return true;
  } catch (err) {
    error(`Database connection failed: ${err.message}`);
    info('Check your CognoDB credentials and instance status');
    return false;
  }
}

async function main() {
  console.log('\n');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log('  Research Knowledge Graph Setup Verification', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');
  
  const checks = {
    'Node.js Version': await checkNodeVersion(),
    'Environment File': checkEnvFile(),
    'Environment Variables': checkEnvVariables(),
    'Dependencies': checkDependencies(),
    'Project Structure': checkProjectStructure(),
    'Git Configuration': checkGitignore(),
  };
  
  // Only test database if previous checks pass
  if (Object.values(checks).every(v => v)) {
    checks['Database Connection'] = await testDatabaseConnection();
  }
  
  console.log('\n');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log('  Summary', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');
  
  const passed = Object.values(checks).filter(v => v).length;
  const total = Object.keys(checks).length;
  
  if (passed === total) {
    success(`All checks passed (${passed}/${total})`);
    console.log('\n');
    info('✨ Your environment is ready! Next steps:');
    info('   1. Run: npm run seed (to load sample data)');
    info('   2. Run: npm run dev (to start the application)');
    info('   3. Open: http://localhost:5173');
    console.log('\n');
    process.exit(0);
  } else {
    error(`Some checks failed (${passed}/${total} passed)`);
    console.log('\n');
    info('Please fix the issues above before proceeding.');
    info('See QUICKSTART.md for detailed setup instructions.');
    console.log('\n');
    process.exit(1);
  }
}

main();
