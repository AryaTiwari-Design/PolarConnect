from app.database.db import connection

def initialize_database():
    with connection() as conn:
        conn.executescript('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            role TEXT NOT NULL DEFAULT 'student',
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
        CREATE TABLE IF NOT EXISTS research_papers (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            authors TEXT NOT NULL,
            year INTEGER NOT NULL,
            category TEXT NOT NULL,
            station TEXT,
            expedition TEXT,
            topic TEXT,
            abstract TEXT,
            pages INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'pending',
            uploaded_by TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS quiz_progress (
            user_id INTEGER NOT NULL,
            quiz_id TEXT NOT NULL,
            score INTEGER NOT NULL,
            total INTEGER NOT NULL,
            completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, quiz_id)
        );
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
            content TEXT NOT NULL,
            sources_json TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        ''')
        columns = {row["name"] for row in conn.execute("PRAGMA table_info(users)").fetchall()}
        if "role" not in columns:
            conn.execute("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'student'")

        from app.services.security import hash_password
        demo_users = [
            ("Admin User", "admin@polarconnect.test", "admin"),
            ("Dr. Meera Nair", "researcher@polarconnect.test", "researcher"),
            ("Aarav Student", "student@polarconnect.test", "student"),
        ]
        for name, email, role in demo_users:
            existing = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
            if existing:
                conn.execute("UPDATE users SET role = ? WHERE email = ?", (role, email))
            else:
                conn.execute(
                    "INSERT INTO users (name, email, role, password_hash) VALUES (?, ?, ?, ?)",
                    (name, email, role, hash_password("ChangeMe123")),
                )
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
        conn.execute("DELETE FROM research_stations WHERE name IN (?, ?, ?)", (
            "Ny-Ålesund Research Area (reference)",
            "McMurdo Region (reference)",
            "Ushuaia Southern Gateway (reference)",
        ))
        stations = [
            ("Bharati", "India", -69.4078, 76.1884, "India's operational Antarctic research station in the Larsemann Hills, commissioned in 2012 for year-round polar research."),
            ("Dakshin Gangotri", "India", -70.0833, 12.0000, "India's first Antarctic research base, established in 1983-84 and later decommissioned after burial by snow and ice."),
            ("Maitri", "India", -70.7658, 11.7370, "India's operational Antarctic research station in the Schirmacher Oasis, established in 1989 for year-round multidisciplinary science."),
        ]
        for station in stations:
            existing = conn.execute("SELECT id FROM research_stations WHERE name = ?", (station[0],)).fetchone()
            if existing:
                conn.execute(
                    "UPDATE research_stations SET country = ?, latitude = ?, longitude = ?, description = ? WHERE id = ?",
                    (station[1], station[2], station[3], station[4], existing["id"]),
                )
            else:
                conn.execute("INSERT INTO research_stations (name, country, latitude, longitude, description) VALUES (?, ?, ?, ?, ?)", station)
        research_papers = [
            ("p1", "Antarctic Ice Shelf Thinning: A Decade of Satellite Altimetry", "M. Nair, R. Iyer", 2022, "Glaciology", "Bharati", "39th ISEA", "Ice shelves", "Satellite altimetry records track how floating ice shelves along the East Antarctic coast changed in height. Warm ocean water reaching shelf undersides is a main driver of thinning.", 42, "approved", "2"),
            ("p2", "Microbial Life in Subglacial Lakes of East Antarctica", "S. Kulkarni, A. Dutta", 2021, "Biology", "Maitri", "38th ISEA", "Extremophiles", "Water and sediment sampled near subglacial lakes show microbial communities surviving in permanent darkness and extreme cold using chemical energy.", 36, "approved", "2"),
            ("p3", "Sea Ice Extent and Climate Feedbacks in the Southern Ocean", "P. Rao, L. Fernandes", 2023, "Climate", "Bharati", "41st ISEA", "Sea ice", "Changes in seasonal sea ice cover affect how much sunlight the ocean absorbs. Less ice means a darker surface, more heat absorbed, and further ice loss.", 58, "approved", "2"),
            ("p4", "Antarctic Krill Distribution and Ocean Warming", "T. Menon, J. George", 2020, "Marine Biology", "Maitri", "36th ISEA", "Krill", "Net surveys show krill swarms shifting with water temperature and sea ice cover. Krill sit at the centre of the Southern Ocean food web.", 31, "approved", "2"),
            ("p5", "Ozone Hole Recovery Observed from Antarctic Ground Stations", "K. Bhatt, N. Sinha", 2022, "Atmospheric Science", "Maitri", "40th ISEA", "Ozone", "Ground-based ozone measurements over several seasons show slow ozone layer recovery after global limits on ozone-depleting chemicals.", 27, "approved", "2"),
            ("p6", "Emperor Penguin Colony Monitoring Using Drone Imagery", "D. Pillai, S. Verma", 2023, "Biology", "Bharati", "42nd ISEA", "Penguins", "Drone surveys count colony size without disturbing the birds. Breeding success depends strongly on stable winter sea ice.", 24, "approved", "2"),
            ("p7", "Snow Accumulation Trends in Dronning Maud Land", "M. Nair, A. Joshi", 2024, "Glaciology", "Maitri", "43rd ISEA", "Snow", "Firn cores and stake measurements estimate annual snow accumulation near Maitri station.", 33, "pending", "2"),
            ("p8", "Geomagnetic Observations at High Latitudes", "R. Chandra", 2024, "Geophysics", "Bharati", "43rd ISEA", "Geomagnetism", "Continuous magnetometer records are compared with solar activity to study high-latitude magnetosphere behaviour.", 29, "pending", "2"),
        ]
        conn.executemany(
            """
            INSERT OR IGNORE INTO research_papers
            (id, title, authors, year, category, station, expedition, topic, abstract, pages, status, uploaded_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            research_papers,
        )
        count = conn.execute("SELECT COUNT(*) AS n FROM education_resources").fetchone()["n"]
        if count == 0:
            resources = [
                ("Introduction to Polar Regions", "Basics", "Learn about the Arctic, Antarctica, sea ice, and polar climate.", "https://nsidc.org/"),
                ("NASA Earth Data", "Data", "Explore Earth observation data and documentation.", "https://earthdata.nasa.gov/"),
                ("NASA POWER Data Access", "Data", "Access meteorological and solar data through NASA POWER.", "https://power.larc.nasa.gov/")
            ]
            conn.executemany("INSERT INTO education_resources (title, category, description, url) VALUES (?, ?, ?, ?)", resources)
