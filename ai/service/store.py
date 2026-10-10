import json
from collections import defaultdict
from pathlib import Path

from .config import DEFAULT_INDEX_PATH
from .vector_store import VectorStoreUnavailable, delete_vectors_for_paper, upsert_vectors

INDEX_PATH = DEFAULT_INDEX_PATH


def load_index() -> list[dict]:
    if not INDEX_PATH.exists():
        return []
    return json.loads(INDEX_PATH.read_text(encoding="utf-8"))


def save_index(chunks: list[dict]) -> None:
    INDEX_PATH.parent.mkdir(parents=True, exist_ok=True)
    temp_path = INDEX_PATH.with_suffix(".tmp")
    temp_path.write_text(json.dumps(chunks, indent=2, ensure_ascii=False), encoding="utf-8")
    temp_path.replace(INDEX_PATH)


def upsert_paper_chunks(paper_id, title, chunks) -> int:
    index = [chunk for chunk in load_index() if str(chunk["paper_id"]) != str(paper_id)]
    prepared_chunks = []
    for position, chunk in enumerate(chunks):
        prepared_chunks.append(
            {"paper_id": str(paper_id), "title": title, "page": chunk["page"], "chunk_id": f"{paper_id}-{position}", "text": chunk["text"]}
        )
    index.extend(prepared_chunks)
    save_index(index)
    try:
        delete_vectors_for_paper(str(paper_id))
        upsert_vectors(prepared_chunks)
    except VectorStoreUnavailable:
        pass
    return len(chunks)


def delete_paper(paper_id) -> int:
    before = load_index()
    after = [chunk for chunk in before if str(chunk["paper_id"]) != str(paper_id)]
    save_index(after)
    try:
        delete_vectors_for_paper(str(paper_id))
    except VectorStoreUnavailable:
        pass
    return len(before) - len(after)


def summarize_documents() -> list[dict]:
    grouped = defaultdict(lambda: {"chunks": 0, "pages": set(), "title": ""})
    for chunk in load_index():
        paper_id = str(chunk["paper_id"])
        grouped[paper_id]["title"] = chunk["title"]
        grouped[paper_id]["chunks"] += 1
        grouped[paper_id]["pages"].add(int(chunk["page"]))
    return [
        {
            "paper_id": paper_id,
            "title": data["title"],
            "chunks": data["chunks"],
            "pages": sorted(data["pages"]),
        }
        for paper_id, data in sorted(grouped.items(), key=lambda item: item[1]["title"].lower())
    ]
