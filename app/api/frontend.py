import os
import re
import json
from io import BytesIO

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import Response
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from app.api.auth import get_current_user
from app.database.db import connection

router = APIRouter(prefix="/api", tags=["Frontend App"])
RAG_SERVICE_URL = os.getenv("RAG_SERVICE_URL", "http://127.0.0.1:8001")

SEED_PAPERS = [
    {
        "id": "p1",
        "title": "Antarctic Ice Shelf Thinning: A Decade of Satellite Altimetry",
        "authors": "M. Nair, R. Iyer",
        "year": 2022,
        "category": "Glaciology",
        "station": "Bharati",
        "expedition": "39th ISEA",
        "topic": "Ice shelves",
        "pages": 42,
        "status": "approved",
        "uploadedBy": "2",
        "abstract": "Satellite altimetry records track how floating ice shelves along the East Antarctic coast changed in height. Warm ocean water reaching shelf undersides is a main driver of thinning.",
    },
    {
        "id": "p2",
        "title": "Microbial Life in Subglacial Lakes of East Antarctica",
        "authors": "S. Kulkarni, A. Dutta",
        "year": 2021,
        "category": "Biology",
        "station": "Maitri",
        "expedition": "38th ISEA",
        "topic": "Extremophiles",
        "pages": 36,
        "status": "approved",
        "uploadedBy": "2",
        "abstract": "Water and sediment sampled near subglacial lakes show microbial communities surviving in permanent darkness and extreme cold using chemical energy.",
    },
    {
        "id": "p3",
        "title": "Sea Ice Extent and Climate Feedbacks in the Southern Ocean",
        "authors": "P. Rao, L. Fernandes",
        "year": 2023,
        "category": "Climate",
        "station": "Bharati",
        "expedition": "41st ISEA",
        "topic": "Sea ice",
        "pages": 58,
        "status": "approved",
        "uploadedBy": "2",
        "abstract": "Changes in seasonal sea ice cover affect how much sunlight the ocean absorbs. Less ice means a darker surface, more heat absorbed, and further ice loss.",
    },
    {
        "id": "p4",
        "title": "Antarctic Krill Distribution and Ocean Warming",
        "authors": "T. Menon, J. George",
        "year": 2020,
        "category": "Marine Biology",
        "station": "Maitri",
        "expedition": "36th ISEA",
        "topic": "Krill",
        "pages": 31,
        "status": "approved",
        "uploadedBy": "2",
        "abstract": "Net surveys show krill swarms shifting with water temperature and sea ice cover. Krill sit at the centre of the Southern Ocean food web.",
    },
    {
        "id": "p5",
        "title": "Ozone Hole Recovery Observed from Antarctic Ground Stations",
        "authors": "K. Bhatt, N. Sinha",
        "year": 2022,
        "category": "Atmospheric Science",
        "station": "Maitri",
        "expedition": "40th ISEA",
        "topic": "Ozone",
        "pages": 27,
        "status": "approved",
        "uploadedBy": "2",
        "abstract": "Ground-based ozone measurements over several seasons show slow ozone layer recovery after global limits on ozone-depleting chemicals.",
    },
    {
        "id": "p6",
        "title": "Emperor Penguin Colony Monitoring Using Drone Imagery",
        "authors": "D. Pillai, S. Verma",
        "year": 2023,
        "category": "Biology",
        "station": "Bharati",
        "expedition": "42nd ISEA",
        "topic": "Penguins",
        "pages": 24,
        "status": "approved",
        "uploadedBy": "2",
        "abstract": "Drone surveys count colony size without disturbing the birds. Breeding success depends strongly on stable winter sea ice.",
    },
    {
        "id": "p7",
        "title": "Snow Accumulation Trends in Dronning Maud Land",
        "authors": "M. Nair, A. Joshi",
        "year": 2024,
        "category": "Glaciology",
        "station": "Maitri",
        "expedition": "43rd ISEA",
        "topic": "Snow",
        "pages": 33,
        "status": "pending",
        "uploadedBy": "2",
        "abstract": "Firn cores and stake measurements estimate annual snow accumulation near Maitri station.",
    },
    {
        "id": "p8",
        "title": "Geomagnetic Observations at High Latitudes",
        "authors": "R. Chandra",
        "year": 2024,
        "category": "Geophysics",
        "station": "Bharati",
        "expedition": "43rd ISEA",
        "topic": "Geomagnetism",
        "pages": 29,
        "status": "pending",
        "uploadedBy": "2",
        "abstract": "Continuous magnetometer records are compared with solar activity to study high-latitude magnetosphere behaviour.",
    },
]

LESSONS = [
    {
        "id": "l1",
        "title": "Meet Antarctica",
        "level": "Beginner",
        "readMinutes": 4,
        "quizId": "q1",
        "icon": "🧊",
        "summary": "The coldest, driest, windiest continent, and why nobody owns it.",
        "content": [
            "Antarctica is the fifth-largest continent and sits almost entirely south of the Antarctic Circle. Around 98% of it is covered by ice.",
            "It is the coldest, driest and windiest continent on Earth. The interior gets so little snowfall that it counts as a desert.",
            "No country owns Antarctica. The Antarctic Treaty sets the continent aside for peaceful use and scientific research.",
        ],
    },
    {
        "id": "l2",
        "title": "Ice, Oceans and Sea Level",
        "level": "Beginner",
        "readMinutes": 5,
        "quizId": "q2",
        "icon": "🌊",
        "summary": "Why ice on land matters more for sea level than ice on the sea.",
        "content": [
            "Antarctica holds most of the world's fresh water as ice, so scientists watch it closely.",
            "Sea ice is frozen ocean water. Land ice sits on rock, and when it enters the ocean, sea level rises.",
            "Ice shelves hold back glaciers. When shelves thin, glaciers can flow faster into the sea.",
        ],
    },
    {
        "id": "l3",
        "title": "Life at the Bottom of the World",
        "level": "Intermediate",
        "readMinutes": 5,
        "quizId": "q3",
        "icon": "🐧",
        "summary": "Penguins, krill and microbes that survive in permanent darkness.",
        "content": [
            "The Southern Ocean food web is built on tiny plants called phytoplankton.",
            "Krill feed on phytoplankton and support whales, seals, penguins and fish.",
            "Even beneath kilometres of ice, microbes can live in dark lakes using chemical energy.",
        ],
    },
    {
        "id": "l4",
        "title": "India in Antarctica",
        "level": "Intermediate",
        "readMinutes": 4,
        "quizId": "q4",
        "icon": "🇮🇳",
        "summary": "From the first expedition to Maitri and Bharati.",
        "content": [
            "India launched its first scientific expedition to Antarctica in 1981.",
            "Dakshin Gangotri was India's first station. Maitri followed in 1989.",
            "Bharati was commissioned in 2012 in the Larsemann Hills and supports modern polar science.",
        ],
    },
]

QUIZZES = {
    "q1": {"id": "q1", "title": "Meet Antarctica", "questions": [
        {"id": "q1a", "text": "How much of Antarctica is covered by ice?", "options": ["About 10%", "About 50%", "About 98%", "All of it"], "answerIndex": 2, "explanation": "Almost all of Antarctica is ice-covered, with a few rocky areas exposed."},
        {"id": "q1b", "text": "Why do scientists call Antarctica a desert?", "options": ["Because it is hot", "Because it gets very little snow or rain", "Because it has sand dunes", "Because it has no ice"], "answerIndex": 1, "explanation": "Deserts are defined by low precipitation, not just heat."},
        {"id": "q1c", "text": "What is the main idea of the Antarctic Treaty?", "options": ["One country owns Antarctica", "Antarctica is for peace and science", "Antarctica is mainly for mining", "Every country gets an equal slice"], "answerIndex": 1, "explanation": "The treaty keeps Antarctica focused on peaceful use and scientific cooperation."},
        {"id": "q1d", "text": "Which continent is Antarctica by size?", "options": ["Smallest", "Third-largest", "Fifth-largest", "Largest"], "answerIndex": 2, "explanation": "Antarctica is the fifth-largest continent, bigger than Europe and Australia."},
        {"id": "q1e", "text": "What is unusual about Antarctica's interior?", "options": ["It gets very little snowfall", "It is covered in forests", "It has warm rain all year", "It has many cities"], "answerIndex": 0, "explanation": "The interior is extremely dry, which is why Antarctica can be described as a polar desert."},
        {"id": "q1f", "text": "What do research stations help scientists do?", "options": ["Collect long-term measurements", "Claim land for countries", "Build tourist cities", "Mine ice for fuel"], "answerIndex": 0, "explanation": "Stations let teams live safely and collect long-running observations that help explain Earth systems."},
    ]},
    "q2": {"id": "q2", "title": "Ice, Oceans and Sea Level", "questions": [
        {"id": "q2a", "text": "Which melting ice matters most for sea-level rise?", "options": ["Floating sea ice", "Ice sitting on land", "Ice in a freezer", "Ice cubes in a drink"], "answerIndex": 1, "explanation": "Land ice adds extra water to the ocean."},
        {"id": "q2b", "text": "What do ice shelves do for glaciers?", "options": ["They melt glaciers faster", "They hold glaciers back", "They turn glaciers blue", "They do not affect glaciers"], "answerIndex": 1, "explanation": "Ice shelves act like a stopper for glaciers behind them."},
        {"id": "q2c", "text": "What is sea ice?", "options": ["Frozen ocean water floating on top", "A glacier that fell into the sea", "Snow sitting on land", "Only broken iceberg pieces"], "answerIndex": 0, "explanation": "Sea ice is ocean water frozen at the surface."},
        {"id": "q2d", "text": "Why does less sea ice create a warming feedback?", "options": ["Dark ocean absorbs more sunlight", "Snow becomes heavier", "Clouds stop forming", "Winds disappear"], "answerIndex": 0, "explanation": "Bright ice reflects sunlight. When darker ocean is exposed, it absorbs more heat and can speed up further melt."},
        {"id": "q2e", "text": "What is an ice shelf?", "options": ["A floating extension of land ice", "A mountain made of sea salt", "A frozen river under a city", "A type of polar cloud"], "answerIndex": 0, "explanation": "Ice shelves are thick floating edges of ice sheets and glaciers."},
        {"id": "q2f", "text": "What can happen when an ice shelf breaks up?", "options": ["Glaciers behind it may speed up", "Sea level instantly drops", "The ocean freezes solid", "The Sun becomes weaker"], "answerIndex": 0, "explanation": "Without the shelf holding them back, glaciers can move faster toward the ocean."},
    ]},
    "q3": {"id": "q3", "title": "Life at the Bottom of the World", "questions": [
        {"id": "q3a", "text": "Which tiny animal feeds many Antarctic animals?", "options": ["Krill", "Polar bears", "Camels", "Sharks"], "answerIndex": 0, "explanation": "Krill are a huge part of the Southern Ocean food web."},
        {"id": "q3b", "text": "When do emperor penguins breed?", "options": ["Summer", "Spring", "Winter", "They do not breed"], "answerIndex": 2, "explanation": "Emperor penguins breed during the Antarctic winter on sea ice."},
        {"id": "q3c", "text": "How can microbes live in dark lakes under ice?", "options": ["They use sunlight", "They use chemical energy", "They eat krill", "They do not need energy"], "answerIndex": 1, "explanation": "Some microbes use chemical reactions for energy."},
        {"id": "q3d", "text": "What starts much of the Southern Ocean food web?", "options": ["Phytoplankton", "Sand dunes", "Polar bears", "Volcano smoke only"], "answerIndex": 0, "explanation": "Tiny phytoplankton use sunlight and become food for krill and other animals."},
        {"id": "q3e", "text": "Why are krill important?", "options": ["Many animals depend on them for food", "They melt ice shelves", "They build research stations", "They create ozone"], "answerIndex": 0, "explanation": "Krill connect tiny ocean plants to larger animals like penguins, seals and whales."},
        {"id": "q3f", "text": "Why use drones to monitor colonies?", "options": ["They can count animals with less disturbance", "They teach penguins to fly", "They warm the ice", "They replace all scientists"], "answerIndex": 0, "explanation": "Drone imagery helps count colonies while keeping people farther from sensitive wildlife."},
    ]},
    "q4": {"id": "q4", "title": "India in Antarctica", "questions": [
        {"id": "q4a", "text": "Which station came first for India in Antarctica?", "options": ["Maitri", "Bharati", "Dakshin Gangotri", "Himadri"], "answerIndex": 2, "explanation": "Dakshin Gangotri was India's first Antarctic station."},
        {"id": "q4b", "text": "Who organises India's Antarctic expeditions?", "options": ["ISRO", "NCPOR", "DRDO", "ICMR"], "answerIndex": 1, "explanation": "NCPOR runs India's polar expeditions under the Ministry of Earth Sciences."},
        {"id": "q4c", "text": "Where is Bharati station?", "options": ["Schirmacher Oasis", "Ross Island", "Larsemann Hills", "Brunt Ice Shelf"], "answerIndex": 2, "explanation": "Bharati is in the Larsemann Hills."},
        {"id": "q4d", "text": "Which Indian station is in the Schirmacher Oasis?", "options": ["Bharati", "Maitri", "Himadri", "Dakshin Gangotri"], "answerIndex": 1, "explanation": "Maitri is located in the Schirmacher Oasis in East Antarctica."},
        {"id": "q4e", "text": "Why was Dakshin Gangotri abandoned?", "options": ["It was buried by snow and ice", "It became too hot", "It floated away", "It was moved to the Arctic"], "answerIndex": 0, "explanation": "Snow and ice burial made the first station unusable, leading India to build Maitri on exposed rock."},
        {"id": "q4f", "text": "What ministry is NCPOR under?", "options": ["Ministry of Earth Sciences", "Ministry of Railways", "Ministry of Textiles", "Ministry of Tourism"], "answerIndex": 0, "explanation": "NCPOR operates under India's Ministry of Earth Sciences."},
    ]},
}

BADGES = [
    {"id": "first-steps", "name": "First Steps", "icon": "🧊", "description": "Finish your first quiz"},
    {"id": "sharp-mind", "name": "Sharp Mind", "icon": "⭐", "description": "Get a perfect quiz score"},
    {"id": "polar-explorer", "name": "Polar Explorer", "icon": "🧭", "description": "Earn 100 XP"},
    {"id": "ice-scholar", "name": "Ice Scholar", "icon": "🎓", "description": "Complete every quiz"},
]

CHAT_TOPICS = [
    ("ice shelf|shelves|thin|melt", "Ice shelves are thinning mainly because warmer ocean water reaches their undersides and melts them from below. Thinner shelves hold back glaciers less effectively.", [{"paper_id": "p1", "page": 18}, {"paper_id": "p3", "page": 7}]),
    ("penguin", "Emperor penguins breed in winter on stable sea ice, so changes in ice conditions affect chick survival. Drone surveys help monitor colonies with less disturbance.", [{"paper_id": "p6", "page": 9}]),
    ("ozone", "The ozone layer over Antarctica is slowly recovering after global limits on ozone-depleting chemicals, though full recovery takes decades.", [{"paper_id": "p5", "page": 5}]),
    ("krill", "Krill are small shrimp-like animals that feed many Southern Ocean animals. Their distribution shifts with water temperature and sea ice.", [{"paper_id": "p4", "page": 12}]),
    ("microb|subglacial|lake|life", "Microbes can live in subglacial lakes in permanent darkness by using chemical energy instead of sunlight.", [{"paper_id": "p2", "page": 14}]),
]


async def _ask_rag_service(question: str):
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(f"{RAG_SERVICE_URL}/chat", json={"question": question, "limit": 5})
            response.raise_for_status()
    except (httpx.HTTPError, ValueError):
        return None

    data = response.json()
    sources = data.get("sources") or []
    answer = str(data.get("answer") or "").strip()
    if not answer or not sources:
        return None
    return {"answer": answer, "sources": sources}


def _seed_papers():
    with connection() as conn:
        for paper in SEED_PAPERS:
            conn.execute(
                """
                INSERT OR IGNORE INTO research_papers
                (id, title, authors, year, category, station, expedition, topic, abstract, pages, status, uploaded_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    paper["id"], paper["title"], paper["authors"], paper["year"], paper["category"],
                    paper["station"], paper["expedition"], paper["topic"], paper["abstract"],
                    paper["pages"], paper["status"], paper["uploadedBy"],
                ),
            )


def _paper_row(row):
    item = dict(row)
    item["uploadedBy"] = str(item.pop("uploaded_by"))
    return item


def _level_info(xp):
    level_size = 100
    level = xp // level_size + 1
    return {"xp": xp, "level": level, "levelStartXp": (level - 1) * level_size, "nextLevelXp": level * level_size}


def _progress(user_id):
    with connection() as conn:
        rows = conn.execute("SELECT quiz_id, score, total FROM quiz_progress WHERE user_id = ?", (user_id,)).fetchall()
    quizzes = {row["quiz_id"]: {"score": row["score"], "total": row["total"]} for row in rows}
    xp = sum(score * 10 + (20 if score == total else 0) for score, total in ((v["score"], v["total"]) for v in quizzes.values()))
    return quizzes, xp


def _save_chat_exchange(user_id: int, question: str, answer: str, sources: list[dict]):
    with connection() as conn:
        conn.execute(
            "INSERT INTO chat_messages (user_id, role, content) VALUES (?, 'user', ?)",
            (user_id, question),
        )
        conn.execute(
            "INSERT INTO chat_messages (user_id, role, content, sources_json) VALUES (?, 'assistant', ?, ?)",
            (user_id, answer, json.dumps(sources)),
        )


@router.get("/research")
def list_research(
    q: str | None = None,
    year: int | None = None,
    category: str | None = None,
    station: str | None = None,
    limit: int | None = Query(default=None, ge=1, le=100),
    mine: str | None = None,
    user: dict = Depends(get_current_user),
):
    _seed_papers()
    params = []
    clauses = []
    if mine == "true":
        clauses.append("uploaded_by = ?")
        params.append(str(user["id"]))
    elif user.get("role") != "admin":
        clauses.append("status = 'approved'")
    if year:
        clauses.append("year = ?")
        params.append(year)
    if category:
        clauses.append("category = ?")
        params.append(category)
    if station:
        clauses.append("station = ?")
        params.append(station)
    if q:
        clauses.append("(title LIKE ? OR authors LIKE ? OR topic LIKE ? OR abstract LIKE ? OR expedition LIKE ?)")
        params.extend([f"%{q}%"] * 5)
    sql = "SELECT * FROM research_papers"
    if clauses:
        sql += " WHERE " + " AND ".join(clauses)
    sql += " ORDER BY year DESC, title"
    if limit:
        sql += " LIMIT ?"
        params.append(limit)
    with connection() as conn:
        rows = conn.execute(sql, params).fetchall()
    return {"items": [_paper_row(row) for row in rows]}


@router.post("/research")
async def upload_research(request: Request, user: dict = Depends(get_current_user)):
    if user.get("role") not in {"researcher", "admin"}:
        raise HTTPException(status_code=403, detail="You do not have access to this.")
    form = await request.form()
    title = str(form.get("title") or "").strip()
    if not title or not form.get("file"):
        raise HTTPException(status_code=400, detail="A title and a PDF file are required.")
    paper_id = f"p{int(__import__('time').time() * 1000)}"
    with connection() as conn:
        conn.execute(
            """
            INSERT INTO research_papers
            (id, title, authors, year, category, station, expedition, topic, abstract, pages, status, uploaded_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
            """,
            (
                paper_id,
                title,
                str(form.get("authors") or user["name"]),
                int(form.get("year") or 2026),
                str(form.get("category") or "Climate"),
                str(form.get("station") or ""),
                str(form.get("expedition") or ""),
                str(form.get("topic") or ""),
                str(form.get("abstract") or ""),
                0,
                str(user["id"]),
            ),
        )
        row = conn.execute("SELECT * FROM research_papers WHERE id = ?", (paper_id,)).fetchone()
    return _paper_row(row)


@router.get("/research/{paper_id}")
def get_research(paper_id: str, user: dict = Depends(get_current_user)):
    _seed_papers()
    with connection() as conn:
        row = conn.execute("SELECT * FROM research_papers WHERE id = ?", (paper_id,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Paper not found.")
    paper = _paper_row(row)
    if paper["status"] != "approved" and user.get("role") != "admin" and paper["uploadedBy"] != str(user["id"]):
        raise HTTPException(status_code=404, detail="Paper not found.")
    return paper


@router.get("/research/{paper_id}/download")
def download_research(paper_id: str, user: dict = Depends(get_current_user)):
    paper = get_research(paper_id, user)
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    pdf.drawString(72, 740, paper["title"][:90])
    pdf.drawString(72, 718, f"Authors: {paper['authors']}")
    pdf.drawString(72, 696, f"Station: {paper['station'] or 'Not specified'}")
    text = pdf.beginText(72, 660)
    for word in paper["abstract"].split():
        line = text.getX()
        if line > 500:
            text.textLine("")
        text.textOut(word + " ")
    pdf.drawText(text)
    pdf.showPage()
    pdf.save()
    return Response(buffer.getvalue(), media_type="application/pdf")


@router.get("/admin/research/pending")
def pending_research(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="You do not have access to this.")
    _seed_papers()
    with connection() as conn:
        rows = conn.execute("SELECT * FROM research_papers WHERE status = 'pending' ORDER BY year DESC").fetchall()
    return {"items": [_paper_row(row) for row in rows]}


@router.post("/admin/research/{paper_id}/{action}")
def moderate_research(paper_id: str, action: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="You do not have access to this.")
    if action not in {"approve", "reject"}:
        raise HTTPException(status_code=404, detail="Unknown action.")
    status = "approved" if action == "approve" else "rejected"
    with connection() as conn:
        conn.execute("UPDATE research_papers SET status = ? WHERE id = ?", (status, paper_id))
        row = conn.execute("SELECT * FROM research_papers WHERE id = ?", (paper_id,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Paper not found.")
    return _paper_row(row)


@router.post("/chat")
async def chat(payload: dict, user: dict = Depends(get_current_user)):
    question = str(payload.get("question") or "").strip()
    if not question:
        raise HTTPException(status_code=400, detail="Please type a question.")
    rag_answer = await _ask_rag_service(question)
    if rag_answer:
        _save_chat_exchange(user["id"], question, rag_answer["answer"], rag_answer["sources"])
        return rag_answer

    lower = question.lower()
    answer = "The approved research papers do not cover this question yet, so I would rather not guess. Try asking about ice shelves, sea ice, krill, penguins, ozone or subglacial life."
    sources = []
    for pattern, topic_answer, topic_sources in CHAT_TOPICS:
        if re.search(pattern, lower):
            answer = topic_answer
            sources = topic_sources
            break
    papers = {paper["id"]: paper for paper in SEED_PAPERS}
    titled_sources = [{**src, "title": papers.get(src["paper_id"], {}).get("title", "Research paper")} for src in sources]
    _save_chat_exchange(user["id"], question, answer, titled_sources)
    return {"answer": answer, "sources": titled_sources}


@router.get("/chat/history")
def chat_history(user: dict = Depends(get_current_user)):
    with connection() as conn:
        rows = conn.execute(
            """
            SELECT role, content, sources_json
            FROM chat_messages
            WHERE user_id = ?
            ORDER BY id ASC
            LIMIT 80
            """,
            (user["id"],),
        ).fetchall()
    items = []
    for row in rows:
        item = {"role": row["role"], "content": row["content"]}
        if row["sources_json"]:
            try:
                item["sources"] = json.loads(row["sources_json"])
            except json.JSONDecodeError:
                item["sources"] = []
        items.append(item)
    return {"items": items}


@router.get("/education")
def list_lessons(user: dict = Depends(get_current_user)):
    quizzes, _ = _progress(user["id"])
    return {"items": [{**lesson, "completed": lesson["quizId"] in quizzes, **quizzes.get(lesson["quizId"], {"score": None, "total": None})} for lesson in LESSONS]}


@router.get("/education/{lesson_id}")
def get_lesson(lesson_id: str, user: dict = Depends(get_current_user)):
    lesson = next((item for item in LESSONS if item["id"] == lesson_id), None)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found.")
    quizzes, _ = _progress(user["id"])
    return {**lesson, "completed": lesson["quizId"] in quizzes, **quizzes.get(lesson["quizId"], {"score": None, "total": None})}


@router.get("/quizzes/{quiz_id}")
def get_quiz(quiz_id: str, user: dict = Depends(get_current_user)):
    quiz = QUIZZES.get(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found.")
    return {"id": quiz["id"], "title": quiz["title"], "questions": [{k: q[k] for k in ("id", "text", "options")} for q in quiz["questions"]]}


@router.post("/quizzes/{quiz_id}/submit")
def submit_quiz(quiz_id: str, payload: dict, user: dict = Depends(get_current_user)):
    quiz = QUIZZES.get(quiz_id)
    answers = payload.get("answers")
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found.")
    if not isinstance(answers, list) or len(answers) != len(quiz["questions"]):
        raise HTTPException(status_code=400, detail="Please answer every question.")
    results = []
    for index, question in enumerate(quiz["questions"]):
        results.append({
            "questionId": question["id"],
            "correct": answers[index] == question["answerIndex"],
            "correctIndex": question["answerIndex"],
            "explanation": question["explanation"],
        })
    score = sum(1 for result in results if result["correct"])
    total = len(results)
    with connection() as conn:
        previous = conn.execute("SELECT score FROM quiz_progress WHERE user_id = ? AND quiz_id = ?", (user["id"], quiz_id)).fetchone()
        if previous is None or score > previous["score"]:
            conn.execute(
                "INSERT OR REPLACE INTO quiz_progress (user_id, quiz_id, score, total) VALUES (?, ?, ?, ?)",
                (user["id"], quiz_id, score, total),
            )
    _, xp = _progress(user["id"])
    xp_earned = score * 10 + (20 if score == total else 0) if previous is None else 0
    earned_badges = []
    if score == total:
        earned_badges.append(BADGES[1])
    if previous is None:
        earned_badges.append(BADGES[0])
    return {"score": score, "total": total, "xpEarned": xp_earned, "newBadges": earned_badges, "results": results, **_level_info(xp)}


@router.get("/users/me/progress")
def user_progress(user: dict = Depends(get_current_user)):
    quizzes, _ = _progress(user["id"])
    return {"completedQuizzes": [{"quizId": quiz_id, **result} for quiz_id, result in quizzes.items()], "totalQuizzes": len(QUIZZES)}


@router.get("/users/me/xp")
def user_xp(user: dict = Depends(get_current_user)):
    _, xp = _progress(user["id"])
    return _level_info(xp)


@router.get("/users/me/badges")
def user_badges(user: dict = Depends(get_current_user)):
    quizzes, xp = _progress(user["id"])
    earned = set()
    if quizzes:
        earned.add("first-steps")
    if any(item["score"] == item["total"] for item in quizzes.values()):
        earned.add("sharp-mind")
    if xp >= 100:
        earned.add("polar-explorer")
    if len(quizzes) >= len(QUIZZES):
        earned.add("ice-scholar")
    return {"items": [{**badge, "earned": badge["id"] in earned} for badge in BADGES]}
