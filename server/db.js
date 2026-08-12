import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

let driver = null;

/**
 * Initialize the CognoDB connection
 */
export function initDriver() {
  if (driver) return driver;

  const uri = process.env.COGNODB_URI;
  const user = process.env.COGNODB_USER;
  const password = process.env.COGNODB_PASSWORD;

  if (!uri || !user || !password) {
    throw new Error('Missing CognoDB connection details. Check your .env file.');
  }

  driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
    maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 hours
    maxConnectionPoolSize: 50,
    connectionAcquisitionTimeout: 2 * 60 * 1000, // 2 minutes
  });

  // Verify connectivity
  driver.verifyConnectivity()
    .then(() => console.log('✓ Connected to CognoDB'))
    .catch(err => console.error('✗ CognoDB connection failed:', err.message));

  return driver;
}

/**
 * Get the driver instance
 */
export function getDriver() {
  if (!driver) {
    throw new Error('Driver not initialized. Call initDriver() first.');
  }
  return driver;
}

/**
 * Execute a read query
 * @param {string} cypher - The Cypher query
 * @param {object} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
export async function runQuery(cypher, params = {}) {
  const session = getDriver().session({ defaultAccessMode: neo4j.session.READ });
  try {
    const result = await session.run(cypher, params);
    return result.records.map(record => record.toObject());
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Execute a write query
 * @param {string} cypher - The Cypher query
 * @param {object} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
export async function runWriteQuery(cypher, params = {}) {
  const session = getDriver().session({ defaultAccessMode: neo4j.session.WRITE });
  try {
    const result = await session.run(cypher, params);
    return result.records.map(record => record.toObject());
  } catch (error) {
    console.error('Write query error:', error.message);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Close the driver connection
 */
export async function closeDriver() {
  if (driver) {
    await driver.close();
    driver = null;
    console.log('CognoDB connection closed');
  }
}

/**
 * Health check for database connectivity
 */
export async function checkHealth() {
  try {
    const session = getDriver().session();
    await session.run('RETURN 1');
    await session.close();
    return { status: 'healthy', message: 'Database connection OK' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeDriver();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDriver();
  process.exit(0);
});
