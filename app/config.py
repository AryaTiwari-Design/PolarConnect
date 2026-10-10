import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
DATABASE_PATH = os.getenv("DATABASE_PATH", str(DATA_DIR / "polar_connect.db"))
SECRET_KEY = os.getenv("POLAR_SECRET_KEY", "local-development-secret-change-this-before-deployment")
TOKEN_TTL_SECONDS = 60 * 60 * 12
