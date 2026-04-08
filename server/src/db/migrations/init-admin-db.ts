import Database from "better-sqlite3";

export function initAdminDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS participant_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      started_at TEXT,
      completed_at TEXT,
      revoked_at TEXT
    );

    CREATE TABLE IF NOT EXISTS participant_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      link_id INTEGER NOT NULL,
      participant_code TEXT NOT NULL UNIQUE,
      consent_accepted INTEGER NOT NULL,
      current_step INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL,
      started_at TEXT NOT NULL,
      last_activity_at TEXT NOT NULL,
      completed_at TEXT,
      FOREIGN KEY (link_id) REFERENCES participant_links(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS session_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      step_number INTEGER NOT NULL,
      stimulus_type TEXT NOT NULL,
      stimulus_label TEXT NOT NULL,
      adjustable_part_label TEXT NOT NULL,
      reference_value REAL NOT NULL,
      final_value REAL NOT NULL,
      deviation REAL NOT NULL,
      clicks_more INTEGER NOT NULL,
      clicks_less INTEGER NOT NULL,
      clicks_total INTEGER NOT NULL,
      time_spent_seconds INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(session_id, step_number),
      FOREIGN KEY (session_id) REFERENCES participant_sessions(id) ON DELETE CASCADE
    );
  `);
}
