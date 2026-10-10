from app.database.db import connection

def initialize_database():
    with connection() as conn:
        conn.executescript('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS polar_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            observation_date TEXT NOT NULL,
            location TEXT NOT NULL,
            latitude REAL,
            longitude REAL,
            temperature_c REAL,
            wind_speed_m_s REAL,
            source TEXT NOT NULL DEFAULT 'Demo dataset',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(observation_date, location, source)
        );
        CREATE TABLE IF NOT EXISTS research_stations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            country TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            description TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS education_resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            url TEXT
        );
        ''')
        count = conn.execute("SELECT COUNT(*) AS n FROM polar_data").fetchone()["n"]
        if count == 0:
            demo = [
                ("2026-09-01", "Demo Arctic Site", 78.22, 15.65, -2.4, 5.1),
                ("2026-09-02", "Demo Arctic Site", 78.22, 15.65, -2.1, 5.4),
                ("2026-09-03", "Demo Arctic Site", 78.22, 15.65, -1.8, 4.8),
                ("2026-09-04", "Demo Arctic Site", 78.22, 15.65, -2.0, 5.2),
                ("2026-09-05", "Demo Arctic Site", 78.22, 15.65, -1.5, 6.0),
                ("2026-09-06", "Demo Arctic Site", 78.22, 15.65, -1.2, 5.8),
                ("2026-09-07", "Demo Arctic Site", 78.22, 15.65, -1.4, 5.5),
                ("2026-09-08", "Demo Arctic Site", 78.22, 15.65, -1.0, 6.2),
                ("2026-09-09", "Demo Arctic Site", 78.22, 15.65, -0.8, 6.4),
                ("2026-09-10", "Demo Arctic Site", 78.22, 15.65, -1.1, 5.9),
                ("2026-09-11", "Demo Arctic Site", 78.22, 15.65, -0.6, 6.1),
                ("2026-09-12", "Demo Arctic Site", 78.22, 15.65, -0.5, 6.5),
                ("2026-09-13", "Demo Arctic Site", 78.22, 15.65, -0.9, 6.0),
                ("2026-09-14", "Demo Arctic Site", 78.22, 15.65, -0.4, 6.7),
            ]
            conn.executemany("INSERT OR IGNORE INTO polar_data (observation_date, location, latitude, longitude, temperature_c, wind_speed_m_s, source) VALUES (?, ?, ?, ?, ?, ?, 'Demo dataset - illustrative only')", demo)
        count = conn.execute("SELECT COUNT(*) AS n FROM research_stations").fetchone()["n"]
        if count == 0:
            stations = [
                ("Ny-Ålesund Research Area (reference)", "Norway", 78.9232, 11.9230, "Reference location for a demo; verify details before scientific use."),
                ("McMurdo Region (reference)", "Antarctica", -77.8419, 166.6863, "Reference location for a demo; verify details before scientific use."),
                ("Ushuaia Southern Gateway (reference)", "Argentina", -54.8019, -68.3030, "Southern gateway reference point; not represented as a research station.")
            ]
            conn.executemany("INSERT INTO research_stations (name, country, latitude, longitude, description) VALUES (?, ?, ?, ?, ?)", stations)
        count = conn.execute("SELECT COUNT(*) AS n FROM education_resources").fetchone()["n"]
        if count == 0:
            resources = [
                ("Introduction to Polar Regions", "Basics", "Learn about the Arctic, Antarctica, sea ice, and polar climate.", "https://nsidc.org/"),
                ("NASA Earth Data", "Data", "Explore Earth observation data and documentation.", "https://earthdata.nasa.gov/"),
                ("NASA POWER Data Access", "Data", "Access meteorological and solar data through NASA POWER.", "https://power.larc.nasa.gov/")
            ]
            conn.executemany("INSERT INTO education_resources (title, category, description, url) VALUES (?, ?, ?, ?)", resources)
