from fastapi import APIRouter, Depends, HTTPException

from ..database import get_db, load_json_data
from ..deps import current_user
from ..schemas import QuizSubmission

router = APIRouter(tags=["education"])


@router.get("/education")
def lessons(user=Depends(current_user)):
    return load_json_data("lessons.json")


@router.get("/education/{lesson_id}")
def lesson(lesson_id: int, user=Depends(current_user)):
    match = next((item for item in load_json_data("lessons.json") if item["id"] == lesson_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return match


@router.get("/quizzes/{quiz_id}")
def quiz(quiz_id: int, user=Depends(current_user)):
    match = next((item for item in load_json_data("quizzes.json") if item["id"] == quiz_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Quiz not found")
    public_questions = [{k: v for k, v in question.items() if k != "answer"} for question in match["questions"]]
    return {**match, "questions": public_questions}


@router.post("/quizzes/{quiz_id}/submit")
def submit_quiz(quiz_id: int, payload: QuizSubmission, user=Depends(current_user)):
    match = next((item for item in load_json_data("quizzes.json") if item["id"] == quiz_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Quiz not found")
    score = 0
    review = []
    for index, question in enumerate(match["questions"]):
        selected = payload.answers[index] if index < len(payload.answers) else None
        is_correct = selected == question["answer"]
        if is_correct:
            score += 1
        review.append(
            {
                "question_id": question["id"],
                "selected": selected,
                "correct": question["answer"],
                "is_correct": is_correct,
                "explanation": question.get("explanation", ""),
            }
        )
    total = len(match["questions"])
    xp_awarded = score * 25
    with get_db() as db:
        db.execute(
            "INSERT INTO quiz_attempts (user_id, quiz_id, score, total) VALUES (?, ?, ?, ?)",
            (user["id"], quiz_id, score, total),
        )
        db.execute("UPDATE users SET xp = xp + ? WHERE id = ?", (xp_awarded, user["id"]))
    return {"score": score, "total": total, "xp_awarded": xp_awarded, "review": review}


@router.get("/users/me/progress")
def progress(user=Depends(current_user)):
    with get_db() as db:
        attempts = db.execute(
            "SELECT quiz_id, score, total, created_at FROM quiz_attempts WHERE user_id = ? ORDER BY created_at DESC",
            (user["id"],),
        ).fetchall()
        fresh_user = db.execute("SELECT xp FROM users WHERE id = ?", (user["id"],)).fetchone()
    xp = fresh_user["xp"]
    badges = []
    if xp >= 25:
        badges.append("Polar Starter")
    if xp >= 100:
        badges.append("Ice Scholar")
    return {"xp": xp, "level": 1 + xp // 100, "badges": badges, "attempts": [dict(row) for row in attempts]}
