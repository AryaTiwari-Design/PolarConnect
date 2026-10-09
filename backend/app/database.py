import json
import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path

DB_PATH = Path(os.getenv("POLARCONNECT_DB", Path(__file__).resolve().parent.parent / "polarconnect.db"))
DATA_DIR = Path(__file__).resolve().parent / "data"


@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def rows_to_dicts(rows):
    return [dict(row) for row in rows]


def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with get_db() as db:
        db.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('student', 'researcher', 'admin')),
                xp INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS research_papers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                abstract TEXT NOT NULL DEFAULT '',
                topic TEXT NOT NULL,
                station TEXT,
                year INTEGER,
                file_path TEXT,
                status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
                uploaded_by INTEGER REFERENCES users(id),
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS chat_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users(id),
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                sources_json TEXT NOT NULL DEFAULT '[]',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS quiz_attempts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users(id),
                quiz_id INTEGER NOT NULL,
                score INTEGER NOT NULL,
                total INTEGER NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            """
        )
        if db.execute("SELECT COUNT(*) AS total FROM users").fetchone()["total"] == 0:
            seed_db(db)


def seed_db(db):
    from .security import hash_password

    users = [
        ("Admin", "admin@polarconnect.test", "ChangeMe123", "admin"),
        ("Researcher", "researcher@polarconnect.test", "ChangeMe123", "researcher"),
        ("Student", "student@polarconnect.test", "ChangeMe123", "student"),
    ]
    db.executemany(
        "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
        [(name, email, hash_password(password), role) for name, email, password, role in users],
    )
    researcher_id = db.execute("SELECT id FROM users WHERE role='researcher'").fetchone()["id"]
    db.executemany(
        """
        INSERT INTO research_papers (title, abstract, topic, station, year, file_path, status, uploaded_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        [
            (
                "Antarctic Climate Indicators",
                "A demo record about polar climate signals, ice sheet change and long-term monitoring.",
                "Climate",
                "Maitri",
                2024,
                "research_docs/approved/Antarctic_factsheet.pdf",
                "approved",
                researcher_id,
            ),
            (
                "Southern Ocean Biodiversity Notes",
                "A demo record about polar ecosystems and conservation challenges.",
                "Biodiversity",
                "Bharati",
                2023,
                "research_docs/approved/p1.pdf",
                "pending",
                researcher_id,
            ),
        ],
    )


def load_json_data(name):
    return json.loads((DATA_DIR / name).read_text(encoding="utf-8"))
