import { Pool } from 'pg';
import { logger } from '../utils/logger';

export const ensureMigrationsTable = async (pool: Pool): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS _prisma_migrations (
      id SERIAL PRIMARY KEY,
      migration_name VARCHAR NOT NULL UNIQUE,
      finished_at TIMESTAMP DEFAULT NOW(),
      execution_time BIGINT DEFAULT 0,
      success BOOLEAN DEFAULT TRUE
    );
  `;

  try {
    await pool.query(query);
    logger.info('Migrations table initialized');
  } catch (error) {
    logger.error('Failed to create migrations table:', error);
    throw error;
  }
};

export const recordMigration = async (
  pool: Pool,
  migrationName: string,
  executionTime: number
): Promise<void> => {
  const query = `
    INSERT INTO _prisma_migrations (migration_name, execution_time, success)
    VALUES ($1, $2, true)
    ON CONFLICT (migration_name) DO NOTHING;
  `;

  try {
    await pool.query(query, [migrationName, executionTime]);
    logger.info(`Migration recorded: ${migrationName}`);
  } catch (error) {
    logger.error(`Failed to record migration ${migrationName}:`, error);
    throw error;
  }
};
