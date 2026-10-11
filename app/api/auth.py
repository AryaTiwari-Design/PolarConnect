from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.database.db import connection
from app.schemas import RegisterRequest, LoginRequest
from app.services.security import hash_password, verify_password, create_token, read_token

router = APIRouter(prefix="/api", tags=["Authentication"])
bearer = HTTPBearer(auto_error=False)

@router.post("/auth/register", status_code=201)
def register(payload: RegisterRequest):
    email = payload.email.strip().lower()
    if "@" not in email or "." not in email.split("@")[-1]:
        raise HTTPException(status_code=422, detail="Please provide a valid email address.")
    with connection() as conn:
        if conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone():
            raise HTTPException(status_code=409, detail="An account with this email already exists.")
        cursor = conn.execute("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                              (payload.name.strip(), email, hash_password(payload.password)))
        user_id = cursor.lastrowid
    return {"message": "Registration successful", "user_id": user_id, "email": email}

@router.post("/auth/login")
def login(payload: LoginRequest):
    email = payload.email.strip().lower()
    with connection() as conn:
        user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
    return {"access_token": create_token(user["id"], user["email"]), "token_type": "bearer",
            "user": {"id": user["id"], "name": user["name"], "email": user["email"]}}

def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)):
    if credentials is None:
        raise HTTPException(status_code=401, detail="Bearer token required.")
    payload = read_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")
    with connection() as conn:
        user = conn.execute("SELECT id, name, email, created_at FROM users WHERE id = ?", (payload["sub"],)).fetchone()
    if not user:
        raise HTTPException(status_code=401, detail="User account no longer exists.")
    return dict(user)

@router.get("/users/me")
def get_me(user: dict = Depends(get_current_user)):
    return user
