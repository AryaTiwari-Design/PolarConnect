# Polar Connect Backend

Beginner-friendly FastAPI backend starter for the Polar Science Portal.

## Setup (Windows PowerShell)
Open this folder in VS Code, then run these commands in the terminal:

```powershell
py -m venv venv
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

If `py` is not recognized, use `python -m venv venv` instead.

Open http://127.0.0.1:8000/docs and http://127.0.0.1:8000/health.

## API features
- Register/login and protected current-user endpoint
- Polar data list/detail/create
- NASA POWER daily data import (requires internet and login)
- Temperature trend, simple regression prediction, Z-score anomalies, insights
- Education resources and research-station reference locations
- PDF report generation
- SQLite database created automatically; MySQL is not needed to run this starter

## Test authentication
1. In `/docs`, use `POST /api/auth/register` with:
   `{"name":"Demo User","email":"demo@example.com","password":"DemoPass123!"}`
2. Use `POST /api/auth/login` with the same email/password.
3. Copy `access_token`, click **Authorize**, and enter `Bearer YOUR_TOKEN` (or just the token if the dialog adds Bearer automatically).
4. Test `GET /api/users/me` and `POST /api/polar-data/fetch-nasa`.

## Important data note
The first run inserts clearly labelled illustrative demo records so endpoints work offline. They are not verified scientific observations. NASA POWER import retrieves data from the public NASA POWER API. The station records are reference/demo locations and should be verified before scientific use.

This is a working MVP starter, not production-hardened software. Before deployment, change the secret key, restrict CORS, add rate limiting, and review authentication/security.
