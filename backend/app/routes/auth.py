from fastapi import APIRouter, Depends, HTTPException

from ..database import get_db
from ..deps import current_user
from ..schemas import LoginIn, RegisterIn
from ..security import create_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


def public_user(user):
    return {"id": user["id"], "name": user["name"], "email": user["email"], "role": user["role"], "xp": user["xp"]}


@router.post("/register")
def register(payload: RegisterIn):
    if payload.role not in {"student", "researcher", "admin"}:
        raise HTTPException(status_code=400, detail="Invalid role")
    with get_db() as db:
        try:
            cursor = db.execute(
                "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
                (payload.name, payload.email, hash_password(payload.password), payload.role),
            )
        except Exception as exc:
            raise HTTPException(status_code=400, detail="Email already registered") from exc
        user = db.execute("SELECT id, name, email, role, xp FROM users WHERE id = ?", (cursor.lastrowid,)).fetchone()
    user = dict(user)
    return {"token": create_token(user), "user": public_user(user)}


@router.post("/login")
def login(payload: LoginIn):
    with get_db() as db:
        user = db.execute("SELECT * FROM users WHERE email = ?", (payload.email,)).fetchone()
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    user = dict(user)
    return {"token": create_token(user), "user": public_user(user)}


@router.get("/me")
def me(user=Depends(current_user)):
    return user
