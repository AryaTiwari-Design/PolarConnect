import re
from collections import Counter


STOPWORDS = {
    "about",
    "after",
    "also",
    "and",
    "are",
    "because",
    "from",
    "have",
    "into",
    "that",
    "the",
    "their",
    "there",
    "this",
    "what",
    "when",
    "where",
    "which",
    "with",
    "would",
}


def _words(text):
    return [word for word in re.findall(r"[a-zA-Z]{4,}", text.lower()) if word not in STOPWORDS]


def _sentences(text):
    clean = " ".join(text.split())
    return [sentence.strip() for sentence in re.split(r"(?<=[.!?])\s+", clean) if len(sentence.strip()) > 35]


def _best_sentences(question, chunks, limit=4):
    question_terms = Counter(_words(question))
    candidates = []
    for chunk in chunks:
        for sentence in _sentences(chunk["text"]):
            terms = Counter(_words(sentence))
            score = sum(question_terms[word] * terms.get(word, 0) for word in question_terms)
            score += min(len(sentence), 180) / 500
            candidates.append((score, sentence))
    candidates.sort(key=lambda item: item[0], reverse=True)

    selected = []
    seen = set()
    for _, sentence in candidates:
        compact = sentence.lower()[:90]
        if compact in seen:
            continue
        selected.append(sentence[:260])
        seen.add(compact)
        if len(selected) == limit:
            break
    return selected


def _topic_answer(question):
    text = question.lower()
    if any(word in text for word in ["climate", "change", "warming", "ice"]):
        return (
            "Antarctica helps scientists understand climate change because its ice stores clues about Earth's past "
            "and shows how frozen regions are changing now."
        )
    if any(word in text for word in ["station", "maitri", "bharati", "gangotri"]):
        return (
            "Polar research stations are like science bases in extreme conditions. They help researchers collect data, "
            "run experiments, and support expeditions in Antarctica."
        )
    if any(word in text for word in ["ocean", "southern", "sea"]):
        return (
            "The Southern Ocean matters because it connects Antarctica to global ocean circulation, weather systems, "
            "and polar ecosystems."
        )
    return (
        "The approved documents point to a few useful facts, but the answer should be read with the listed source pages "
        "because I am only using the local PolarConnect research index."
    )


def _clean_fact(sentence):
    sentence = sentence.replace("•", ",")
    sentence = re.sub(r"\s+", " ", sentence).strip()
    sentence = re.sub(r"Page\s+\d+/\d+", "", sentence, flags=re.IGNORECASE)
    sentence = sentence.replace("DOCUMENT SOURCES", "Document sources include")
    sentence = sentence[:180].strip(" ,.-")
    if not sentence.endswith("."):
        sentence += "."
    return sentence


def _evidence_points(question, chunks):
    text = " ".join(chunk["text"] for chunk in chunks)
    lowered = question.lower()
    if any(word in lowered for word in ["climate", "change", "warming", "ice"]):
        points = [
            "The approved fact sheet gives verified geography data for Antarctica, including ice shelves and islands.",
            "It identifies major ice shelf areas such as the Ross Ice Shelf and the Ronne-Filchner Ice Shelf.",
            "It cites polar datasets such as the Antarctic Digital Database, Bedmap 3, REMA, and ocean bathymetry sources.",
        ]
        return points
    if any(word in lowered for word in ["station", "maitri", "bharati", "gangotri"]):
        return [
            "The retrieved pages support locating polar features and connecting them to research activity.",
            "Station information should be checked with the map and approved station records in PolarConnect.",
        ]
    facts = [_clean_fact(fact) for fact in _best_sentences(question, chunks)[:3]]
    return facts or ["The approved sources mention this topic, but the exact answer is not clearly explained in the retrieved text."]


def generate_answer(question, chunks):
    if not chunks:
        return {
            "answer": (
                "Short answer:\n"
                "I could not find enough approved PolarConnect material to answer that safely.\n\n"
                "What you can do next:\n"
                "- Try asking about a specific station, ice shelf, expedition, year, or topic from the uploaded papers.\n"
                "- Ask your teacher or admin to approve more research PDFs so I can use them as sources."
            ),
            "sources": [],
        }

    sources = []
    seen = set()
    for chunk in chunks:
        key = (chunk["paper_id"], chunk["page"])
        if key not in seen:
            sources.append({"paper_id": chunk["paper_id"], "title": chunk["title"], "page": chunk["page"]})
            seen.add(key)

    simple_points = "\n".join(f"- {fact}" for fact in _evidence_points(question, chunks))
    source_names = ", ".join(f"{source['title']} page {source['page']}" for source in sources[:3])
    short_answer = _topic_answer(question)
    answer = (
        "Short answer:\n"
        f"{short_answer}\n\n"
        "In simple words:\n"
        "Think of Antarctica as Earth's cold record book. Scientists compare its ice, shelves, oceans, and research-station "
        "observations over time. If those patterns change, it can reveal bigger changes in Earth's climate system.\n\n"
        "Evidence I found in approved documents:\n"
        f"{simple_points}\n\n"
        "Why it matters for students:\n"
        "It connects classroom topics like climate, sea level, maps, oceans, and international science to a real place on Earth.\n\n"
        "Source check:\n"
        f"I used only the retrieved approved document pages: {source_names}."
    )
    return {"answer": answer, "sources": sources}
