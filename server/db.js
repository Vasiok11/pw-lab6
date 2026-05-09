import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Initialize and connect to the SQLite database
export async function setupDatabase() {
  const db = await open({
    filename: './server/database.sqlite',
    driver: sqlite3.Database
  });

  console.log('[SYSTEM] Connected to SQLite database.');

  // Create Skills Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      proficiency TEXT NOT NULL,
      level INTEGER NOT NULL,
      linkedResources TEXT -- Stored as JSON string array
    )
  `);

  // Create Projects Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      techStack TEXT, -- Stored as JSON string array
      repoLink TEXT,
      liveLink TEXT,
      highlighted INTEGER DEFAULT 0 -- 0 for false, 1 for true
    )
  `);

  // Create Jobs Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      status TEXT NOT NULL,
      dateApplied TEXT,
      location TEXT,
      url TEXT,
      linkedSkills TEXT -- Stored as JSON string array
    )
  `);

  // Create Learning Resources Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS learning_resources (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT,
      type TEXT NOT NULL,
      source TEXT,
      progress INTEGER DEFAULT 0,
      status TEXT,
      dateAdded TEXT
    )
  `);

  console.log('[SYSTEM] Database tables verified.');
  
  return db;
}
